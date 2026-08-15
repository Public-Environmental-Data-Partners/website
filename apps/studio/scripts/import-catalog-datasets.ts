/**
 * Import catalog datasets from CSV into Sanity as drafts.
 *
 * Unique key: normalized DOI, else backup URL. Skips rows with neither.
 * Re-import fills empty fields only (does not overwrite existing Studio values).
 *
 * Runbook: docs/ops/data-catalog-import.md
 * Field rules: docs/decisions/0011-data-catalog.md
 */
import {readFileSync} from 'node:fs'
import {dirname, isAbsolute, resolve} from 'node:path'
import {fileURLToPath} from 'node:url'

import {createClient} from '@sanity/client'

const HERE = dirname(fileURLToPath(import.meta.url))
const DEFAULT_CSV = resolve(HERE, 'fixtures/sample-combined.csv')

type CsvRow = Record<string, string>

function loadEnvFile(path: string) {
  try {
    const text = readFileSync(path, 'utf8')
    for (const line of text.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const eq = trimmed.indexOf('=')
      if (eq < 1) continue
      const key = trimmed.slice(0, eq).trim()
      let value = trimmed.slice(eq + 1).trim()
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1)
      }
      if (!process.env[key]) process.env[key] = value
    }
  } catch {
    // optional
  }
}

loadEnvFile(resolve(HERE, '../.env'))
loadEnvFile(resolve(HERE, '../../web/.env.local'))

function parseCsv(text: string): CsvRow[] {
  const rows: string[][] = []
  let row: string[] = []
  let cell = ''
  let i = 0
  let inQuotes = false
  const s = text.replace(/^\uFEFF/, '')
  while (i < s.length) {
    const ch = s[i]
    if (inQuotes) {
      if (ch === '"') {
        if (s[i + 1] === '"') {
          cell += '"'
          i += 2
          continue
        }
        inQuotes = false
        i += 1
        continue
      }
      cell += ch
      i += 1
      continue
    }
    if (ch === '"') {
      inQuotes = true
      i += 1
      continue
    }
    if (ch === ',') {
      row.push(cell)
      cell = ''
      i += 1
      continue
    }
    if (ch === '\n' || (ch === '\r' && s[i + 1] === '\n')) {
      row.push(cell)
      cell = ''
      if (row.some((c) => c.length > 0)) rows.push(row)
      row = []
      i += ch === '\r' ? 2 : 1
      continue
    }
    if (ch === '\r') {
      row.push(cell)
      cell = ''
      if (row.some((c) => c.length > 0)) rows.push(row)
      row = []
      i += 1
      continue
    }
    cell += ch
    i += 1
  }
  row.push(cell)
  if (row.some((c) => c.length > 0)) rows.push(row)
  if (rows.length === 0) return []
  const headers = rows[0].map((h) => h.trim())
  return rows.slice(1).map((cols) => {
    const obj: CsvRow = {}
    headers.forEach((h, idx) => {
      obj[h] = (cols[idx] ?? '').trim()
    })
    return obj
  })
}

function cell(row: CsvRow, ...names: string[]): string {
  for (const name of names) {
    const v = row[name]
    if (v) return v.trim()
  }
  return ''
}

export function normalizeDoi(raw: string): string | null {
  const t = raw.trim()
  if (!t) return null
  const m = t.match(
    /(?:doi:\s*|https?:\/\/(?:dx\.)?doi\.org\/)?(10\.\d{4,9}\/[-._;()/:A-Za-z0-9]+)/i,
  )
  if (!m) return null
  return m[1].replace(/\/+$/, '').toLowerCase()
}

function extractUrls(raw: string): string[] {
  if (!raw.trim()) return []
  const matches = raw.match(/https?:\/\/[^\s,;]+/gi) ?? []
  return matches.map((u) => u.replace(/[),.\]]+$/, ''))
}

function pickBackupUrl(raw: string): {url: string | null; flag: boolean} {
  const urls = extractUrls(raw)
  if (urls.length === 0) return {url: null, flag: false}
  const dataverse = urls.find((u) => /dataverse|dvn\//i.test(u))
  if (dataverse) return {url: dataverse, flag: false}
  const zenodo = urls.find((u) => /zenodo/i.test(u))
  if (zenodo) return {url: zenodo, flag: false}
  if (urls.length === 1) return {url: urls[0], flag: false}
  return {url: urls[0], flag: true}
}

function parseBackupHost(url: string): {host: string; isFile: boolean} {
  let pathname = ''
  try {
    pathname = new URL(url).pathname
  } catch {
    pathname = url
  }
  const isFile = /\.(zip|csv|pdf|tar|gz|tgz|xlsx?|json|xml|nc|tiff?)$/i.test(pathname)
  const u = url.toLowerCase()
  let host = 'Archive'
  if (u.includes('zenodo')) host = 'Zenodo'
  else if (u.includes('dataverse') || u.includes('/dvn/')) host = 'Harvard Dataverse'
  else if (u.includes('github')) host = 'GitHub'
  else if (u.includes('sciop')) host = 'SciOp'
  return {host, isFile}
}

function sanityIdFromKey(key: string): string {
  const slug = key
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96)
  return `catalog.${slug || 'row'}`
}

const ISO = /(\d{4})-(\d{1,2})-(\d{1,2})/
const MDY = /(\d{1,2})\/(\d{1,2})\/(\d{4})/

function toIso(year: number, month: number, day: number): string | null {
  if (month < 1 || month > 12 || day < 1 || day > 31) return null
  const mm = String(month).padStart(2, '0')
  const dd = String(day).padStart(2, '0')
  return `${year}-${mm}-${dd}`
}

function parseOneDate(token: string): string | null {
  const t = token.trim()
  let m = t.match(ISO)
  if (m) return toIso(Number(m[1]), Number(m[2]), Number(m[3]))
  m = t.match(MDY)
  if (m) return toIso(Number(m[3]), Number(m[1]), Number(m[2]))
  return null
}

function allDates(raw: string): string[] {
  const out: string[] = []
  const iso = [...raw.matchAll(/(\d{4})-(\d{1,2})-(\d{1,2})/g)]
  for (const m of iso) {
    const d = toIso(Number(m[1]), Number(m[2]), Number(m[3]))
    if (d) out.push(d)
  }
  const mdy = [...raw.matchAll(/(\d{1,2})\/(\d{1,2})\/(\d{4})/g)]
  for (const m of mdy) {
    const d = toIso(Number(m[3]), Number(m[1]), Number(m[2]))
    if (d) out.push(d)
  }
  return out
}

function parseTimePeriod(raw: string): {
  start?: string
  end?: string
  needsReview: boolean
} {
  const t = raw.trim()
  if (!t) return {needsReview: false}
  const startLabel = t.match(/start date:\s*([^\n;]+)/i)
  const endLabel = t.match(/end date:\s*([^\n;]+)/i)
  if (startLabel || endLabel) {
    const start = startLabel ? parseOneDate(startLabel[1]) : undefined
    const end = endLabel ? parseOneDate(endLabel[1]) : undefined
    if (start && end) return {start, end, needsReview: false}
    return {start: start ?? undefined, end: end ?? undefined, needsReview: true}
  }
  const through = t.split(/\s+through\s+|\s+to\s+| – | — | - /i)
  if (through.length === 2) {
    const start = parseOneDate(through[0])
    const end = parseOneDate(through[1])
    if (start && end) return {start, end, needsReview: false}
  }
  const dates = allDates(t)
  if (dates.length >= 2) {
    dates.sort()
    return {start: dates[0], end: dates[dates.length - 1], needsReview: false}
  }
  if (dates.length === 1) return {start: dates[0], end: dates[0], needsReview: true}
  return {needsReview: true}
}

function parseDownloadDate(raw: string): {date?: string; needsReview: boolean} {
  const t = raw.trim()
  if (!t) return {needsReview: false}
  const dates = allDates(t)
  if (dates.length === 0) return {needsReview: true}
  dates.sort()
  return {date: dates[0], needsReview: dates.length > 1 ? false : false}
}

function isEmptyValue(value: unknown): boolean {
  if (value === undefined || value === null) return true
  if (typeof value === 'string') return value.trim() === ''
  if (typeof value === 'boolean') return false
  if (Array.isArray(value)) return value.length === 0
  return false
}

function fillEmpty(existing: Record<string, unknown> | null, next: Record<string, unknown>) {
  if (!existing) return next
  const out: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(next)) {
    if (k.startsWith('_')) continue
    if (isEmptyValue(existing[k])) out[k] = v
  }
  return out
}

function rowToDoc(
  row: CsvRow,
): {ok: false; skip: string} | {ok: true; id: string; doc: Record<string, unknown>} {
  const doiRaw = cell(row, 'Deposit Digital Identifier')
  const doi = normalizeDoi(doiRaw)
  const backupCell = cell(row, 'Backup Location (URL)')
  const backupPick = pickBackupUrl(backupCell)
  let importKey = doi
  if (!importKey && backupPick.url) {
    const asDoi = normalizeDoi(backupPick.url)
    importKey = asDoi || backupPick.url.replace(/\/+$/, '').toLowerCase()
  }
  if (!importKey) {
    return {ok: false, skip: 'missing DOI and backup URL'}
  }

  const original = extractUrls(cell(row, 'Original Location (URL)', 'Original URL'))[0] || undefined
  const backupUrl = backupPick.url || (doi ? `https://doi.org/${doi}` : undefined)
  if (!backupUrl) {
    return {ok: false, skip: 'missing backup URL'}
  }
  const {host, isFile} = parseBackupHost(backupUrl)
  const timeRaw = cell(row, 'Time Period / Temporal Resolution')
  const time = parseTimePeriod(timeRaw)
  const downRaw = cell(row, 'Date Downloaded', 'Capture / Download Date')
  const down = parseDownloadDate(downRaw)
  const metadata = extractUrls(cell(row, 'PEDP Metadata Doc'))[0]

  const doc: Record<string, unknown> = {
    _type: 'catalogDataset',
    importKey,
    archivedTitle: cell(row, 'Archived Title') || undefined,
    datasetTitle: cell(row, 'Dataset Title', 'Dataset/Tool Name') || undefined,
    orgAbbrev: cell(row, 'Org Abbrev', 'Agency or Org Abbrev') || undefined,
    depositId: doi || undefined,
    agency: cell(row, 'Agency') || undefined,
    subAgency: cell(row, 'Sub-Agency/Org') || undefined,
    pedpAgencyForSorting: cell(row, 'PEDP Agency for Sorting') || undefined,
    originalUrl: original,
    backupUrl,
    backupHost: host,
    backupIsFile: isFile,
    metadataDocUrl: metadata,
    timePeriodRaw: timeRaw || undefined,
    timePeriodStart: time.start,
    timePeriodEnd: time.end,
    timePeriodNeedsReview: time.needsReview,
    downloadDateRaw: downRaw || undefined,
    downloadDate: down.date,
    downloadDateNeedsReview: down.needsReview,
    summary: cell(row, 'Summary') || undefined,
    description: cell(row, 'Description') || undefined,
    archiveNotes: cell(row, 'Notes') || undefined,
    keywords: cell(row, 'Keywords') || undefined,
    cchTerms: cell(row, 'CCH Terms') || undefined,
    subject: cell(row, 'Subject') || undefined,
    datasetSize: cell(row, 'Dataset Size') || undefined,
    datasetSizeUnits: cell(row, 'Dataset Size_Units (MB,GB,TB, etc.)') || undefined,
  }

  return {ok: true, id: sanityIdFromKey(importKey), doc}
}

async function main() {
  const args = process.argv.slice(2)
  const dryRun = args.includes('--dry-run')
  const csvArg = args.find((a) => a !== '--' && !a.startsWith('--'))
  const csvPath = csvArg
    ? isAbsolute(csvArg)
      ? csvArg
      : resolve(process.cwd(), csvArg)
    : DEFAULT_CSV

  const projectId =
    process.env.SANITY_STUDIO_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.SANITY_STUDIO_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET
  const token = process.env.SANITY_API_WRITE_TOKEN
  if (!projectId || !dataset) {
    throw new Error('Missing SANITY_STUDIO_PROJECT_ID / DATASET')
  }
  if (!dryRun && !token) {
    throw new Error('Missing SANITY_API_WRITE_TOKEN (or pass --dry-run)')
  }

  const rows = parseCsv(readFileSync(csvPath, 'utf8'))
  console.log(`CSV ${csvPath}: ${rows.length} rows`)

  const client = createClient({
    projectId,
    dataset,
    apiVersion: '2024-01-01',
    token,
    useCdn: false,
  })

  const skipped: {reason: string; title: string}[] = []
  let created = 0
  let updated = 0

  for (const row of rows) {
    const title = cell(row, 'Archived Title', 'Dataset Title', 'Dataset/Tool Name') || '(untitled)'
    const mapped = rowToDoc(row)
    if (!mapped.ok) {
      skipped.push({reason: mapped.skip, title})
      console.warn(`SKIP ${title}: ${mapped.skip}`)
      continue
    }
    const {id, doc} = mapped
    const draftId = `drafts.${id}`
    if (dryRun) {
      console.log(`DRY ${draftId} ${title} key=${doc.importKey}`)
      created += 1
      continue
    }
    const existing = (await client.getDocument(draftId)) || (await client.getDocument(id)) || null
    const patch = fillEmpty(existing as Record<string, unknown> | null, doc)
    if (!existing) {
      await client.create({_id: draftId, _type: 'catalogDataset', ...doc})
      created += 1
      console.log(`CREATE ${draftId}`)
    } else if (Object.keys(patch).length > 0) {
      await client
        .patch(existing._id as string)
        .set(patch)
        .commit()
      updated += 1
      console.log(`PATCH ${existing._id} fields=${Object.keys(patch).join(',')}`)
    } else {
      console.log(`NOOP ${existing._id}`)
    }
  }

  console.log(`done created=${created} updated=${updated} skipped=${skipped.length}`)
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])
if (isMain) {
  main().catch((err) => {
    console.error(err)
    process.exit(1)
  })
}

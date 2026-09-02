/**
 * Import catalog datasets from CSV into Sanity as drafts.
 *
 * Unique key: normalized DOI, else backup URL. Skips rows with neither.
 * Also skips missing title, missing agency, unusable backup URL, and
 * duplicate import keys in the same CSV (first row wins).
 * Re-import fills empty fields only unless --overwrite is passed.
 * --overwrite updates a draft (never the published doc). It only writes
 * fields whose CSV columns are present. Empty cells unset those fields,
 * except Summary, which is set only when the CSV has a non-empty Summary.
 * Mentioned in is not in the CSV and is never written.
 * A changed DOI is a new key and will not update the old document.
 * Studio-created documents (random ids) are matched by importKey.
 * --check-data reports errors and warnings and does not write.
 *
 * Runbook: docs/ops/data-catalog-import.md
 * Field rules: docs/decisions/0011-data-catalog.md
 */
import {existsSync, readFileSync} from 'node:fs'
import {basename, dirname, isAbsolute, resolve} from 'node:path'
import {fileURLToPath} from 'node:url'

import {createClient} from '@sanity/client'

import {
  catalogImportKey,
  decodeUrlish,
  normalizeDoi,
  parseBackupHost,
} from '../lib/catalog-dataset-key'

const HERE = dirname(fileURLToPath(import.meta.url))
const DEFAULT_CSV = resolve(HERE, 'fixtures/sample-combined.csv')
const REPO_ROOT = resolve(HERE, '../../..')

function resolveCsvPath(csvArg: string): string {
  if (isAbsolute(csvArg)) return csvArg
  const candidates = [
    resolve(process.cwd(), csvArg),
    resolve(REPO_ROOT, csvArg),
    resolve(HERE, csvArg),
  ]
  const found = candidates.find((p) => existsSync(p))
  if (found) return found
  throw new Error(`CSV not found: ${csvArg} (tried ${candidates.join(', ')})`)
}

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

const TITLE_HEADERS = [
  'Archived Title',
  'Dataset Title',
  'Dataset/Tool Name',
  'Dataset/Tool Name Backup',
] as const

function cell(row: CsvRow, ...names: string[]): string {
  for (const name of names) {
    const v = row[name]
    if (v) return v.trim()
  }
  return ''
}

function displayTitle(row: CsvRow): string {
  return cell(row, ...TITLE_HEADERS) || '(untitled)'
}

function isHttpUrl(raw: string): boolean {
  try {
    const parsed = new URL(raw)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

function backupCellFlags(raw: string): {multipleUrls: boolean; extraText: boolean} {
  const urls = extractUrls(raw)
  const leftover = raw
    .replace(/https?:\/\/[^\s,;]+/gi, '')
    .replace(/[(),.;:/#?&=_\s-]+/g, '')
    .trim()
  return {multipleUrls: urls.length > 1, extraText: leftover.length > 0}
}

function extractUrls(raw: string): string[] {
  if (!raw.trim()) return []
  const matches = raw.match(/https?:\/\/[^\s,;]+/gi) ?? []
  return matches.map((u) => decodeUrlish(u.replace(/[),.\]]+$/, '')))
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

function hasHeader(headers: Set<string>, ...names: string[]): boolean {
  return names.some((n) => headers.has(n))
}

function writableFieldsFromCsv(headers: Set<string>): Set<string> {
  const fields = new Set<string>(['importKey'])
  const add = (ok: boolean, ...keys: string[]) => {
    if (ok) for (const k of keys) fields.add(k)
  }
  add(hasHeader(headers, 'Archived Title'), 'archivedTitle')
  add(
    hasHeader(headers, 'Dataset Title', 'Dataset/Tool Name', 'Dataset/Tool Name Backup'),
    'datasetTitle',
  )
  add(hasHeader(headers, 'Org Abbrev', 'Agency or Org Abbrev'), 'orgAbbrev')
  add(hasHeader(headers, 'Deposit Digital Identifier'), 'depositId')
  add(hasHeader(headers, 'Agency'), 'agency')
  add(hasHeader(headers, 'Sub-Agency/Org'), 'subAgency')
  add(hasHeader(headers, 'Original Location (URL)', 'Original URL'), 'originalUrl')
  add(hasHeader(headers, 'Backup Location (URL)'), 'backupUrl', 'backupHost', 'backupIsFile')
  add(hasHeader(headers, 'PEDP Metadata Doc'), 'metadataDocUrl')
  add(
    hasHeader(headers, 'Time Period / Temporal Resolution'),
    'timePeriodRaw',
    'timePeriodStart',
    'timePeriodEnd',
    'timePeriodNeedsReview',
  )
  add(
    hasHeader(headers, 'Date Downloaded', 'Capture / Download Date'),
    'downloadDateRaw',
    'downloadDate',
    'downloadDateNeedsReview',
  )
  add(hasHeader(headers, 'Summary'), 'summary')
  add(hasHeader(headers, 'Description'), 'description')
  add(hasHeader(headers, 'Notes'), 'archiveNotes')
  add(hasHeader(headers, 'Keywords'), 'keywords')
  add(hasHeader(headers, 'CCH Terms'), 'cchTerms')
  add(hasHeader(headers, 'Subject'), 'subject')
  add(hasHeader(headers, 'Dataset Size'), 'datasetSize')
  add(hasHeader(headers, 'Dataset Size_Units (MB,GB,TB, etc.)'), 'datasetSizeUnits')
  return fields
}

function overwritePatch(
  next: Record<string, unknown>,
  allowed: Set<string>,
): {
  set: Record<string, unknown>
  unset: string[]
} {
  const set: Record<string, unknown> = {}
  const unset: string[] = []
  for (const [k, v] of Object.entries(next)) {
    if (k.startsWith('_')) continue
    if (!allowed.has(k)) continue
    if (k === 'summary' && isEmptyValue(v)) continue
    if (isEmptyValue(v)) unset.push(k)
    else set[k] = v
  }
  return {set, unset}
}

function withoutRev(doc: Record<string, unknown>): Record<string, unknown> {
  const {_id, _rev, _updatedAt, ...rest} = doc
  return rest
}

type CatalogClient = ReturnType<typeof createClient>
type SanityDoc = {_id: string} & Record<string, unknown>

async function loadById(client: CatalogClient, id: string): Promise<SanityDoc | null> {
  return ((await client.getDocument(id)) as SanityDoc | undefined) || null
}

function publishedIdFrom(id: string): string {
  return id.startsWith('drafts.') ? id.slice(7) : id
}

/**
 * Match catalog.{slug} first (CSV import ids), then any document with this
 * importKey (Studio-created documents use random ids).
 */
async function findExisting(
  client: CatalogClient,
  catalogId: string,
  importKey: string,
): Promise<{id: string; draft: SanityDoc | null; published: SanityDoc | null}> {
  const draft = await loadById(client, `drafts.${catalogId}`)
  const published = await loadById(client, catalogId)
  if (draft || published) {
    return {id: catalogId, draft, published}
  }

  const ids = await client.fetch<string[]>(
    `*[_type == "catalogDataset" && importKey == $key]._id`,
    {key: importKey},
  )
  const uniqueBases = [...new Set(ids.map(publishedIdFrom))]
  if (uniqueBases.length === 0) {
    return {id: catalogId, draft: null, published: null}
  }
  if (uniqueBases.length > 1) {
    console.warn(`WARN multiple documents for key=${importKey}: ${uniqueBases.join(', ')}`)
  }
  const id = uniqueBases[0]
  if (!id) {
    return {id: catalogId, draft: null, published: null}
  }
  return {
    id,
    draft: await loadById(client, `drafts.${id}`),
    published: await loadById(client, id),
  }
}

function rowToDoc(
  row: CsvRow,
): {ok: false; skip: string} | {ok: true; id: string; doc: Record<string, unknown>} {
  const title = cell(row, ...TITLE_HEADERS)
  if (!title) {
    return {ok: false, skip: 'missing title'}
  }
  const agency = cell(row, 'Agency')
  if (!agency) {
    return {ok: false, skip: 'missing agency'}
  }

  const doiRaw = cell(row, 'Deposit Digital Identifier')
  const doi = normalizeDoi(doiRaw)
  const backupCell = cell(row, 'Backup Location (URL)')
  const backupPick = pickBackupUrl(backupCell)
  if (backupCell && !backupPick.url && !doi) {
    return {ok: false, skip: 'unusable backup URL'}
  }
  if (backupPick.url && !isHttpUrl(backupPick.url)) {
    return {ok: false, skip: 'unusable backup URL'}
  }
  const importKey = catalogImportKey(doiRaw, backupPick.url || '')
  if (!importKey) {
    return {ok: false, skip: 'missing DOI and backup URL'}
  }

  const original = extractUrls(cell(row, 'Original Location (URL)', 'Original URL'))[0] || undefined
  const backupUrl = backupPick.url || (doi ? `https://doi.org/${doi}` : undefined)
  if (!backupUrl) {
    return {ok: false, skip: 'missing backup URL'}
  }
  if (!isHttpUrl(backupUrl)) {
    return {ok: false, skip: 'unusable backup URL'}
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
    datasetTitle:
      cell(row, 'Dataset Title', 'Dataset/Tool Name', 'Dataset/Tool Name Backup') || undefined,
    orgAbbrev: cell(row, 'Org Abbrev', 'Agency or Org Abbrev') || undefined,
    depositId: doi || undefined,
    agency,
    subAgency: cell(row, 'Sub-Agency/Org') || undefined,
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

type CheckItem = {row: number; title: string; detail?: string}

type CheckReport = {
  fileErrors: string[]
  errors: Record<string, CheckItem[]>
  warnings: Record<string, CheckItem[]>
  duplicateKeyRows: Set<number>
}

const ERROR_ORDER = [
  'missing title',
  'missing agency',
  'missing DOI and backup URL',
  'missing backup URL',
  'unusable backup URL',
  'duplicate import key',
]

const WARN_ORDER = [
  'no metadata doc',
  'no summary or description',
  'no time period',
  'no download date',
  'unknown backup host',
  'multiple backup URLs or extra text',
  'duplicate title (different keys)',
  'already in Sanity',
]

function addCheckItem(bucket: Record<string, CheckItem[]>, code: string, item: CheckItem) {
  if (!bucket[code]) bucket[code] = []
  bucket[code].push(item)
}

function headerErrors(headers: Set<string>): string[] {
  const out: string[] = []
  if (!hasHeader(headers, 'Agency')) out.push('missing header: Agency')
  if (!hasHeader(headers, 'Backup Location (URL)')) {
    out.push('missing header: Backup Location (URL)')
  }
  if (!hasHeader(headers, ...TITLE_HEADERS)) {
    out.push(
      'missing title header: need Archived Title, Dataset Title, Dataset/Tool Name, or Dataset/Tool Name Backup',
    )
  }
  return out
}

function buildCheckReport(rows: CsvRow[], headers: Set<string>): CheckReport {
  const report: CheckReport = {
    fileErrors: headerErrors(headers),
    errors: {},
    warnings: {},
    duplicateKeyRows: new Set(),
  }
  const firstKey = new Map<string, {row: number; title: string}>()
  const titles = new Map<string, CheckItem[]>()

  rows.forEach((row, index) => {
    const sheetRow = index + 2
    const title = displayTitle(row)
    const mapped = rowToDoc(row)
    if (!mapped.ok) {
      addCheckItem(report.errors, mapped.skip, {row: sheetRow, title})
      return
    }
    const importKey = String(mapped.doc.importKey)
    const prev = firstKey.get(importKey)
    if (prev) {
      report.duplicateKeyRows.add(index)
      addCheckItem(report.errors, 'duplicate import key', {
        row: sheetRow,
        title,
        detail: `key=${importKey} also row ${prev.row} (${prev.title})`,
      })
      return
    }
    firstKey.set(importKey, {row: sheetRow, title})

    const titleList = titles.get(title.toLowerCase()) ?? []
    titleList.push({row: sheetRow, title, detail: `key=${importKey}`})
    titles.set(title.toLowerCase(), titleList)

    if (!mapped.doc.metadataDocUrl) {
      addCheckItem(report.warnings, 'no metadata doc', {row: sheetRow, title})
    }
    if (!mapped.doc.summary && !mapped.doc.description) {
      addCheckItem(report.warnings, 'no summary or description', {row: sheetRow, title})
    }
    if (!mapped.doc.timePeriodStart && !mapped.doc.timePeriodEnd) {
      addCheckItem(report.warnings, 'no time period', {row: sheetRow, title})
    }
    if (!mapped.doc.downloadDate) {
      addCheckItem(report.warnings, 'no download date', {row: sheetRow, title})
    }
    if (mapped.doc.backupHost === 'Archive') {
      addCheckItem(report.warnings, 'unknown backup host', {
        row: sheetRow,
        title,
        detail: String(mapped.doc.backupUrl),
      })
    }
    const flags = backupCellFlags(cell(row, 'Backup Location (URL)'))
    if (flags.multipleUrls || flags.extraText) {
      addCheckItem(report.warnings, 'multiple backup URLs or extra text', {
        row: sheetRow,
        title,
      })
    }
  })

  for (const items of titles.values()) {
    if (items.length < 2) continue
    for (const item of items) {
      addCheckItem(report.warnings, 'duplicate title (different keys)', item)
    }
  }

  return report
}

function countCheckItems(bucket: Record<string, CheckItem[]>): number {
  return Object.values(bucket).reduce((n, items) => n + items.length, 0)
}

const LIST_ALL_BELOW = 25
const TITLE_WIDTH = 64

function shortTitle(title: string): string {
  if (title.length <= TITLE_WIDTH) return title
  return `${title.slice(0, TITLE_WIDTH - 1)}…`
}

function orderedCodes(order: string[], bucket: Record<string, CheckItem[]>): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  for (const code of order) {
    if (!bucket[code]?.length) continue
    seen.add(code)
    out.push(code)
  }
  for (const code of Object.keys(bucket)) {
    if (seen.has(code) || bucket[code].length === 0) continue
    out.push(code)
  }
  return out
}

function printItemList(items: CheckItem[]) {
  for (const item of items) {
    console.log(`    ${String(item.row).padStart(4, ' ')}  ${shortTitle(item.title)}`)
    if (item.detail) {
      console.log(`          ${item.detail}`)
    }
  }
}

function printCheckReport(report: CheckReport, csvPath: string, rowCount: number) {
  const errorCount = report.fileErrors.length + countCheckItems(report.errors)
  const warnCount = countCheckItems(report.warnings)
  const errorCodes = orderedCodes(ERROR_ORDER, report.errors)
  const warnCodes = orderedCodes(WARN_ORDER, report.warnings)
  const rule = '─'.repeat(72)

  console.log('')
  console.log(rule)
  console.log('Catalog CSV check')
  console.log(rule)
  console.log(`  File      ${basename(csvPath)}`)
  console.log(`  Path      ${csvPath}`)
  console.log(`  Rows      ${rowCount}`)
  console.log(`  Errors    ${errorCount}`)
  console.log(`  Warnings  ${warnCount}`)
  console.log(rule)

  if (errorCount === 0 && warnCount === 0 && report.fileErrors.length === 0) {
    console.log('')
    console.log('  No issues.')
    console.log('')
    return
  }

  if (errorCount > 0) {
    console.log('')
    console.log('ERRORS')
    console.log('------')
    for (const err of report.fileErrors) {
      console.log(`  • ${err}`)
    }
    for (const code of errorCodes) {
      const items = report.errors[code]
      console.log('')
      console.log(`  ${code}  (${items.length})`)
      printItemList(items)
    }
  }

  if (warnCount > 0) {
    console.log('')
    console.log('WARNINGS')
    console.log('--------')
    console.log('')
    const nameWidth = Math.max(...warnCodes.map((c) => c.length), 8)
    for (const code of warnCodes) {
      console.log(
        `  ${code.padEnd(nameWidth)}  ${String(report.warnings[code].length).padStart(4, ' ')}`,
      )
    }
    for (const code of warnCodes) {
      const items = report.warnings[code]
      if (items.length > LIST_ALL_BELOW) continue
      console.log('')
      console.log(`  ${code}  (${items.length})`)
      printItemList(items)
    }
  }

  console.log('')
  console.log(rule)
  console.log(
    `  Result  ${errorCount > 0 ? 'FAIL' : 'PASS'}   errors=${errorCount}  warnings=${warnCount}`,
  )
  console.log(rule)
  console.log('')
}

async function addSanityWouldPatch(report: CheckReport, rows: CsvRow[], client: CatalogClient) {
  const keys: string[] = []
  const byKey = new Map<string, CheckItem>()
  rows.forEach((row, index) => {
    if (report.duplicateKeyRows.has(index)) return
    const mapped = rowToDoc(row)
    if (!mapped.ok) return
    const importKey = String(mapped.doc.importKey)
    keys.push(importKey)
    byKey.set(importKey, {
      row: index + 2,
      title: displayTitle(row),
      detail: `key=${importKey}`,
    })
  })
  if (keys.length === 0) return
  const existing = await client.fetch<{importKey: string}[]>(
    `*[_type == "catalogDataset" && importKey in $keys]{importKey}`,
    {keys},
  )
  for (const doc of existing) {
    const item = byKey.get(doc.importKey)
    if (item) addCheckItem(report.warnings, 'already in Sanity', item)
  }
}

async function main() {
  const args = process.argv.slice(2)
  const checkData = args.includes('--check-data')
  const dryRun = args.includes('--dry-run')
  const overwrite = args.includes('--overwrite')
  const csvArg = args.find((a) => a !== '--' && !a.startsWith('--'))
  const csvPath = csvArg ? resolveCsvPath(csvArg) : DEFAULT_CSV

  const projectId =
    process.env.SANITY_STUDIO_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.SANITY_STUDIO_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET
  const token = process.env.SANITY_API_WRITE_TOKEN

  const rows = parseCsv(readFileSync(csvPath, 'utf8'))
  const headers = new Set(Object.keys(rows[0] ?? {}))
  const writable = writableFieldsFromCsv(headers)
  const report = buildCheckReport(rows, headers)

  if (checkData) {
    if (projectId && dataset && token) {
      const client = createClient({
        projectId,
        dataset,
        apiVersion: '2024-01-01',
        token,
        useCdn: false,
      })
      await addSanityWouldPatch(report, rows, client)
    }
    printCheckReport(report, csvPath, rows.length)
    const errorCount = report.fileErrors.length + countCheckItems(report.errors)
    if (errorCount > 0) process.exit(1)
    return
  }

  if (!projectId || !dataset) {
    throw new Error('Missing SANITY_STUDIO_PROJECT_ID / DATASET')
  }
  if (!dryRun && !token) {
    throw new Error('Missing SANITY_API_WRITE_TOKEN (or pass --dry-run or --check-data)')
  }
  if (report.fileErrors.length > 0) {
    for (const err of report.fileErrors) console.error(`ERROR ${err}`)
    throw new Error('CSV header errors. Fix the file or inspect with --check-data.')
  }

  console.log(`CSV ${csvPath}: ${rows.length} rows${overwrite ? ' overwrite' : ''}`)

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

  for (const [index, row] of rows.entries()) {
    const title = displayTitle(row)
    const mapped = rowToDoc(row)
    if (!mapped.ok) {
      skipped.push({reason: mapped.skip, title})
      console.warn(`SKIP ${title}: ${mapped.skip}`)
      continue
    }
    if (report.duplicateKeyRows.has(index)) {
      skipped.push({reason: 'duplicate import key', title})
      console.warn(`SKIP ${title}: duplicate import key`)
      continue
    }
    const {id: catalogId, doc} = mapped
    const importKey = String(doc.importKey)
    if (dryRun) {
      console.log(
        `DRY ${overwrite ? 'OVERWRITE ' : ''}drafts.${catalogId} ${title} key=${importKey}`,
      )
      created += 1
      continue
    }
    const found = await findExisting(client, catalogId, importKey)
    const draftId = `drafts.${found.id}`
    const existing = found.draft || found.published
    if (!existing) {
      await client.create({_id: draftId, _type: 'catalogDataset', ...doc})
      created += 1
      console.log(`CREATE ${draftId}`)
      continue
    }
    if (overwrite) {
      if (!found.draft) {
        await client.create({
          _id: draftId,
          _type: 'catalogDataset',
          ...withoutRev(existing),
        })
        console.log(`DRAFT ${draftId}`)
      }
      const {set, unset} = overwritePatch(doc, writable)
      if (Object.keys(set).length === 0 && unset.length === 0) {
        console.log(`NOOP ${draftId}`)
        continue
      }
      let patch = client.patch(draftId)
      if (Object.keys(set).length > 0) patch = patch.set(set)
      if (unset.length > 0) patch = patch.unset(unset)
      await patch.commit()
      updated += 1
      const unsetLog = unset.length ? ` unset=${unset.join(',')}` : ''
      console.log(`OVERWRITE ${draftId} set=${Object.keys(set).join(',')}${unsetLog}`)
      continue
    }
    const patch = fillEmpty(existing, doc)
    if (Object.keys(patch).length > 0) {
      await client.patch(existing._id).set(patch).commit()
      updated += 1
      console.log(`PATCH ${existing._id} fields=${Object.keys(patch).join(',')}`)
    } else {
      console.log(`NOOP ${existing._id}`)
    }
  }

  const warnCount = countCheckItems(report.warnings)
  const warnNote = warnCount > 0 ? ` warnings=${warnCount} (see --check-data)` : ''
  console.log(`done created=${created} updated=${updated} skipped=${skipped.length}${warnNote}`)
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])
if (isMain) {
  main().catch((err) => {
    console.error(err)
    process.exit(1)
  })
}

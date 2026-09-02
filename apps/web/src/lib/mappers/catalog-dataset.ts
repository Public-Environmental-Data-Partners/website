import {resolveContentLink} from '@/lib/content-link'
import type {CatalogDatasetFields, DataCatalogCtaFields} from '@/lib/queries/data-catalog'

export const CATALOG_PAGE_SIZE = 10
export const SUMMARY_MAX_CHARS = 450

export type CatalogCtaProps = {
  blurb: string
  label: string
  href: string
  external: boolean
}

export type CatalogMentionedLink = {
  key: string
  label: string
  href: string
  external: boolean
}

export type CatalogCardProps = {
  id: string
  title: string
  agency: string
  subAgency: string | null
  orgAbbrev: string | null
  timePeriodLabel: string
  downloadDateLabel: string
  backupUrl: string
  backupHost: string
  backupIsFile: boolean
  originalUrl: string | null
  metadataDocUrl: string | null
  description: string
  descriptionTruncated: boolean
  archiveNotes: string | null
  keywords: string | null
  mentionedIn: CatalogMentionedLink[]
  searchText: string
}

function formatMdY(iso: string | null | undefined): string | null {
  if (!iso) return null
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (!m) return null
  return `${Number(m[2])}/${Number(m[3])}/${m[1]}`
}

export function formatTimePeriod(
  start: string | null | undefined,
  end: string | null | undefined,
): string {
  const a = formatMdY(start)
  const b = formatMdY(end)
  if (a && b) return `${a} - ${b}`
  if (a) return a
  return 'See backup'
}

export function formatDownloadDate(iso: string | null | undefined): string {
  return formatMdY(iso) ?? 'Not recorded'
}

export function formatKeywords(raw: string | null | undefined): string | null {
  if (!raw) return null
  const parts = raw
    .split(/[,;\n]+/)
    .map((part) => part.trim())
    .filter(Boolean)
  if (parts.length === 0) return null
  return parts.join(', ')
}

function truncateSummary(text: string): {text: string; truncated: boolean} {
  const trimmed = text.trim()
  if (trimmed.length <= SUMMARY_MAX_CHARS) {
    return {text: trimmed, truncated: false}
  }
  return {text: `${trimmed.slice(0, SUMMARY_MAX_CHARS).trimEnd()}…`, truncated: true}
}

export function mapCatalogCta(cta: DataCatalogCtaFields): CatalogCtaProps | null {
  if (!cta) return null
  const blurb = cta.blurb?.trim() ?? ''
  const label = cta.label?.trim() ?? ''
  const resolved = resolveContentLink(cta.link)
  if (!blurb && !label && !resolved) return null
  return {
    blurb,
    label,
    href: resolved?.href ?? '',
    external: resolved?.external ?? false,
  }
}

export function mapCatalogDataset(doc: CatalogDatasetFields): CatalogCardProps | null {
  const title = (doc.archivedTitle || doc.datasetTitle || '').trim()
  const agency = doc.agency?.trim() ?? ''
  const backupUrl = doc.backupUrl?.trim() ?? ''
  if (!title || !agency || !backupUrl) return null

  const bodySource = (doc.summary || doc.description || '').trim()
  const {text: description, truncated} = truncateSummary(bodySource)
  const mentionedIn: CatalogMentionedLink[] = []
  for (const item of doc.mentionedIn ?? []) {
    if (!item) continue
    const label = item.label?.trim()
    const resolved = resolveContentLink(item.link)
    if (!label || !resolved) continue
    mentionedIn.push({
      key: item._key || resolved.href,
      label,
      href: resolved.href,
      external: resolved.external,
    })
  }

  const searchText = [
    title,
    doc.archivedTitle,
    doc.datasetTitle,
    agency,
    doc.subAgency,
    doc.archiveNotes,
    doc.keywords,
    doc.description,
    doc.summary,
    formatTimePeriod(doc.timePeriodStart, doc.timePeriodEnd),
    doc.cchTerms,
    doc.subject,
    doc.depositId,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

  return {
    id: doc._id,
    title,
    agency,
    subAgency: doc.subAgency?.trim() || null,
    orgAbbrev: doc.orgAbbrev?.trim() || null,
    timePeriodLabel: formatTimePeriod(doc.timePeriodStart, doc.timePeriodEnd),
    downloadDateLabel: formatDownloadDate(doc.downloadDate),
    backupUrl,
    backupHost: doc.backupHost?.trim() || 'Archive',
    backupIsFile: Boolean(doc.backupIsFile),
    originalUrl: doc.originalUrl?.trim() || null,
    metadataDocUrl: doc.metadataDocUrl?.trim() || null,
    description,
    descriptionTruncated: truncated,
    archiveNotes: doc.archiveNotes?.trim() || null,
    keywords: formatKeywords(doc.keywords),
    mentionedIn,
    searchText,
  }
}

export function catalogButtonLabel(card: CatalogCardProps): string {
  if (card.backupIsFile) return 'Download'
  return `Open in ${card.backupHost}`
}

export function filterCatalogCards(cards: CatalogCardProps[], query: string): CatalogCardProps[] {
  const tokens = query.toLowerCase().trim().split(/\s+/).filter(Boolean)
  if (tokens.length === 0) return cards
  return cards.filter((card) => tokens.every((t) => card.searchText.includes(t)))
}

export function sortCatalogCards(
  cards: CatalogCardProps[],
  key: 'name' | 'agency',
  dir: 'asc' | 'desc',
): CatalogCardProps[] {
  const mul = dir === 'asc' ? 1 : -1
  return [...cards].sort((a, b) => {
    const av = key === 'name' ? a.title : a.agency
    const bv = key === 'name' ? b.title : b.agency
    return av.localeCompare(bv, undefined, {sensitivity: 'base'}) * mul
  })
}

export function paginateCatalog<T>(items: T[], page: number, pageSize = CATALOG_PAGE_SIZE) {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize))
  const safePage = Math.min(Math.max(1, page), totalPages)
  const start = (safePage - 1) * pageSize
  return {
    page: safePage,
    totalPages,
    slice: items.slice(start, start + pageSize),
  }
}

export function catalogPageItems(totalPages: number, current: number): Array<number | 'ellipsis'> {
  if (totalPages <= 7) {
    return Array.from({length: totalPages}, (_, i) => i + 1)
  }
  const items: Array<number | 'ellipsis'> = [1]
  const windowStart = Math.max(2, current - 1)
  const windowEnd = Math.min(totalPages - 1, current + 1)
  if (windowStart > 2) items.push('ellipsis')
  for (let n = windowStart; n <= windowEnd; n += 1) items.push(n)
  if (windowEnd < totalPages - 1) items.push('ellipsis')
  items.push(totalPages)
  return items
}

/**
 * Split a catalog query into AND tokens. Quoted spans stay as one phrase.
 * Straight and curly quotes are syntax, not characters to match.
 * Tokens match whole words (or a whole quoted phrase), not substrings.
 */
export function catalogSearchTokens(query: string): string[] {
  const tokens: string[] = []
  const tokenRe =
    /["\u201C\u201D]([^"\u201C\u201D]*)["\u201C\u201D]?|['\u2018\u2019]([^'\u2018\u2019]*)['\u2018\u2019]?|(\S+)/g
  for (const match of query.toLowerCase().matchAll(tokenRe)) {
    const token = (match[1] ?? match[2] ?? match[3] ?? '').replace(/\s+/g, ' ').trim()
    if (token) tokens.push(token)
  }
  return tokens
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function catalogTokenMatches(searchText: string, token: string): boolean {
  const escaped = escapeRegExp(token)
  return new RegExp(`(?<![A-Za-z0-9_])${escaped}(?![A-Za-z0-9_])`).test(searchText)
}

export function catalogMatchesQuery(searchText: string, query: string): boolean {
  const tokens = catalogSearchTokens(query)
  if (tokens.length === 0) return true
  return tokens.every((token) => catalogTokenMatches(searchText, token))
}

export type CatalogSearchSource = {
  title: string
  archivedTitle?: string | null
  datasetTitle?: string | null
  agency?: string | null
  subAgency?: string | null
  orgAbbrev?: string | null
  archiveNotes?: string | null
  keywords?: string | null
  description?: string | null
  summary?: string | null
  timePeriod?: string | null
  cchTerms?: string | null
  subject?: string | null
  depositId?: string | null
}

/** Lowercased blob matched by catalog search. Org abbrev is the card pill. */
export function catalogCardSearchText(source: CatalogSearchSource): string {
  return [
    source.title,
    source.archivedTitle,
    source.datasetTitle,
    source.agency,
    source.subAgency,
    source.orgAbbrev,
    source.archiveNotes,
    source.keywords,
    source.description,
    source.summary,
    source.timePeriod,
    source.cchTerms,
    source.subject,
    source.depositId,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
}

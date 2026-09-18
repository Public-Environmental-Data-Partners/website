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

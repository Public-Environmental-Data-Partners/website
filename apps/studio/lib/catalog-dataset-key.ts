/** Unique key and backup-host helpers shared by Studio and CSV import. */

export function decodeUrlish(raw: string): string {
  const t = raw.trim()
  if (!t) return t
  try {
    return decodeURIComponent(t)
  } catch {
    return t
  }
}

export function normalizeDoi(raw: string): string | null {
  const t = decodeUrlish(raw)
  if (!t) return null
  const m = t.match(
    /(?:doi:\s*|https?:\/\/(?:dx\.)?doi\.org\/)?(10\.\d{4,9}\/[-._;()/:A-Za-z0-9]+)/i,
  )
  if (!m) return null
  return m[1].replace(/\/+$/, '').toLowerCase()
}

/**
 * Normalized DOI if present, otherwise normalized backup URL.
 * Matches the CSV import unique key.
 */
export function catalogImportKey(depositId: string, backupUrl: string): string | null {
  const fromDoi = normalizeDoi(depositId)
  if (fromDoi) return fromDoi
  const url = decodeUrlish(backupUrl)
  if (!url) return null
  const asDoi = normalizeDoi(url)
  if (asDoi) return asDoi
  return url.replace(/\/+$/, '').toLowerCase()
}

export function parseBackupHost(url: string): {host: string; isFile: boolean} {
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

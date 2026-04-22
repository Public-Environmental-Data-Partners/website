/**
 * True when `pathname` is this route or a nested path under it.
 * Home (`/`) only matches exactly so every path does not read as “home”.
 */
export function isActiveNavPath(pathname: string, href: string): boolean {
  const path = pathname.endsWith('/') && pathname !== '/' ? pathname.slice(0, -1) : pathname
  if (href === '/') {
    return path === '/'
  }
  const target = href.endsWith('/') && href !== '/' ? href.slice(0, -1) : href
  if (path === target) {
    return true
  }
  return path.startsWith(`${target}/`)
}

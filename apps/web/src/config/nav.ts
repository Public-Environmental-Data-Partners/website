/**
 * Shared nav types and non-CMS links (donate, privacy). Primary nav items come from Sanity
 * `siteNavigation` via `getMainNav()`.
 */

export type NavLeaf = {
  label: string
  href: string
}

export type NavGroup = {
  kind: 'group'
  /** Stable id for keys / analytics */
  id: string
  label: string
  items: NavLeaf[]
}

export type NavLink = {
  kind: 'link'
  label: string
  href: string
}

export type MainNavEntry = NavGroup | NavLink

export const donateNav: NavLeaf = {
  label: 'Donate',
  href: '/donate',
}

export const privacyPolicyNav: NavLeaf = {
  label: 'Privacy Policy',
  href: '/privacy-policy',
}

export function pickNavGroup(entries: MainNavEntry[], id: string): NavGroup | undefined {
  for (const entry of entries) {
    if (entry.kind === 'group' && entry.id === id) {
      return entry
    }
  }
  return undefined
}

/** Footer column 3: same order as primary `link` entries, then privacy (not in header). */
export function footerUtilityLinksFrom(entries: MainNavEntry[]): NavLeaf[] {
  const links = entries.filter((e): e is NavLink => e.kind === 'link')
  return [...links, privacyPolicyNav]
}

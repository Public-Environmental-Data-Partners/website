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

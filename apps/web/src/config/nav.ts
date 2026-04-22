/**
 * Single source of truth for primary navigation. Paths match App Router segments.
 * Desktop “What we do” uses a Radix dropdown; mobile uses a sheet with the same entries.
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

export const mainNav: MainNavEntry[] = [
  {
    kind: 'group',
    id: 'what-we-do',
    label: 'What we do',
    items: [
      {label: 'Data preservation', href: '/what-we-do/data-preservation'},
      {label: 'Tool development', href: '/what-we-do/tool-development'},
      {label: 'Advocacy', href: '/what-we-do/advocacy'},
    ],
  },
  {kind: 'link', label: 'How we work', href: '/how-we-work'},
  {kind: 'link', label: 'Get involved', href: '/get-involved'},
  {kind: 'link', label: 'About', href: '/about'},
  {kind: 'link', label: "What's happening", href: '/whats-happening'},
]

export const donateNav: NavLeaf = {
  label: 'Donate',
  href: '/donate',
}

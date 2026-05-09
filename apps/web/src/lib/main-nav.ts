import {draftMode} from 'next/headers'
import {cache} from 'react'

import {type MainNavEntry, type NavLeaf} from '@/config/nav'
import {sanityFetch} from '@/sanity/live'

/** Load the `siteNavigation` singleton and map to `MainNavEntry[]` (empty if missing or invalid). */
const NAV_QUERY = `*[_type == "siteNavigation" && _id == "siteNavigation"][0]{
  entries[]->{
    _type,
    _id,
    label,
    path,
    sitePage->{
      slug
    },
    items[]->{
      _id,
      label,
      path,
      sitePage->{
        slug
      }
    }
  }
}`

type NavLinkGroq = {
  _type: 'siteNavLink'
  _id: string
  label?: string | null
  path?: string | null
  sitePage?: {slug?: {current?: string | null} | null} | null
}

type NavGroupGroq = {
  _type: 'siteNavGroup'
  _id: string
  label?: string | null
  items?: NavLinkGroq[] | null
}

type SiteNavigationGroq = {
  entries?: (NavLinkGroq | NavGroupGroq | null)[] | null
}

function resolveHref(link: NavLinkGroq): string | null {
  const slug = link.sitePage?.slug?.current?.trim()
  if (slug) {
    return slug.startsWith('/') ? slug : `/${slug}`
  }
  const p = link.path?.trim()
  if (!p) {
    return null
  }
  return p.startsWith('/') ? p : `/${p}`
}

function mapLinkItem(link: NavLinkGroq): NavLeaf | null {
  const label = link.label?.trim()
  const href = resolveHref(link)
  if (!label || !href) {
    return null
  }
  return {label, href}
}

function toKebabCase(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function mapEntry(entry: NavLinkGroq | NavGroupGroq): MainNavEntry | null {
  if (entry._type === 'siteNavLink') {
    const leaf = mapLinkItem(entry)
    if (!leaf) {
      return null
    }
    return {kind: 'link', label: leaf.label, href: leaf.href}
  }
  if (entry._type === 'siteNavGroup') {
    const label = entry.label?.trim()
    if (!label) {
      return null
    }
    const id = toKebabCase(label) || entry._id
    const items: NavLeaf[] = []
    for (const item of entry.items ?? []) {
      const leaf = mapLinkItem(item)
      if (leaf) {
        items.push(leaf)
      }
    }
    if (items.length === 0) {
      return null
    }
    return {kind: 'group', id, label, items}
  }
  return null
}

function mapSiteNavigationData(data: SiteNavigationGroq | null): MainNavEntry[] {
  if (!data?.entries?.length) {
    return []
  }
  const out: MainNavEntry[] = []
  for (const entry of data.entries) {
    if (!entry) {
      continue
    }
    const mapped = mapEntry(entry)
    if (mapped) {
      out.push(mapped)
    }
  }
  return out
}

async function loadMainNav(): Promise<MainNavEntry[]> {
  const {isEnabled: isDraftMode} = await draftMode()
  const {data} = await sanityFetch({
    query: NAV_QUERY,
    perspective: isDraftMode ? 'drafts' : 'published',
  })

  return mapSiteNavigationData(data as SiteNavigationGroq | null)
}

/** Primary nav for the header; deduped per request when called from multiple server components. */
export const getMainNav = cache(loadMainNav)

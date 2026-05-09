import {draftMode} from 'next/headers'
import {cache} from 'react'

import {sanityFetch} from '@/sanity/live'

export type FooterLinkItem = {
  kind: 'link'
  label: string
  href: string
}

export type FooterGroupItem = {
  kind: 'group'
  label: string
  items: FooterLinkItem[]
}

export type FooterItem = FooterLinkItem | FooterGroupItem

export type SiteFooterData = {
  column1Items: FooterItem[]
  column2Items: FooterItem[]
}

const FOOTER_QUERY = `*[_type == "siteFooter" && _id == "siteFooter"][0]{
  column1Items[]->{
    _type,
    label,
    path,
    title,
    slug,
    sitePage->{
      slug
    },
    items[]->{
      _type,
      label,
      path,
      sitePage->{
        slug
      }
    }
  },
  column2Items[]->{
    _type,
    label,
    path,
    title,
    slug,
    sitePage->{
      slug
    },
    items[]->{
      _type,
      label,
      path,
      sitePage->{
        slug
      }
    }
  }
}`

type NavLinkDoc = {
  _type: 'siteNavLink'
  label?: string | null
  path?: string | null
  sitePage?: {slug?: {current?: string | null} | null} | null
}

type SitePageDoc = {
  _type: 'sitePage'
  title?: string | null
  slug?: {current?: string | null} | null
}

type NavGroupDoc = {
  _type: 'siteNavGroup'
  label?: string | null
  items?: (NavLinkDoc | null)[] | null
}

type FooterItemDoc = NavLinkDoc | SitePageDoc | NavGroupDoc

type SiteFooterGroq = {
  column1Items?: (FooterItemDoc | null)[] | null
  column2Items?: (FooterItemDoc | null)[] | null
}

function normalizePath(path: string | null | undefined): string | null {
  const p = (path ?? '').trim()
  if (!p) {
    return null
  }
  return p.startsWith('/') ? p : `/${p}`
}

function hrefFromNavLink(link: NavLinkDoc): string | null {
  const slug = link.sitePage?.slug?.current?.trim()
  if (slug) {
    return normalizePath(slug)
  }
  return normalizePath(link.path)
}

function hrefFromSitePage(page: SitePageDoc): string | null {
  return normalizePath(page.slug?.current ?? null)
}

function mapLinkItem(doc: NavLinkDoc): FooterLinkItem | null {
  const label = doc.label?.trim()
  const href = hrefFromNavLink(doc)
  if (!label || !href) {
    return null
  }
  return {kind: 'link', label, href}
}

function mapFooterItem(doc: FooterItemDoc | null): FooterItem | null {
  if (!doc) {
    return null
  }
  if (doc._type === 'siteNavGroup') {
    const label = doc.label?.trim()
    if (!label) {
      return null
    }
    const items: FooterLinkItem[] = []
    for (const entry of doc.items ?? []) {
      if (!entry) {
        continue
      }
      const mapped = mapLinkItem(entry)
      if (mapped) {
        items.push(mapped)
      }
    }
    if (items.length === 0) {
      return null
    }
    return {kind: 'group', label, items}
  }
  if (doc._type === 'siteNavLink') {
    return mapLinkItem(doc)
  }
  if (doc._type === 'sitePage') {
    const label = doc.title?.trim()
    const href = hrefFromSitePage(doc)
    if (!label || !href) {
      return null
    }
    return {kind: 'link', label, href}
  }
  return null
}

function mapFooterData(data: SiteFooterGroq | null): SiteFooterData | null {
  if (!data) {
    return null
  }
  const mapColumn = (items: (FooterItemDoc | null)[] | null | undefined): FooterItem[] => {
    const out: FooterItem[] = []
    for (const item of items ?? []) {
      const mapped = mapFooterItem(item)
      if (mapped) {
        out.push(mapped)
      }
    }
    return out
  }
  return {
    column1Items: mapColumn(data.column1Items),
    column2Items: mapColumn(data.column2Items),
  }
}

async function loadSiteFooter(): Promise<SiteFooterData | null> {
  const {isEnabled: isDraftMode} = await draftMode()
  const {data} = await sanityFetch({
    query: FOOTER_QUERY,
    perspective: isDraftMode ? 'drafts' : 'published',
  })
  return mapFooterData(data as SiteFooterGroq | null)
}

/** Footer content from CMS; returns null when singleton is missing. */
export const getSiteFooter = cache(loadSiteFooter)

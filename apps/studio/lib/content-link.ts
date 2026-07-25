/** Shared content-link constants, queries, and validation helpers (Studio). */

export const CONTENT_LINK_API_VERSION = '2024-01-01'

/** Canonical News & Updates hub path (not a `sitePage` document). */
export const NEWS_HUB_PATH = '/news-and-updates'

export type ContentLinkType = 'internal' | 'external'

export type ContentLinkReference = {
  _type: 'reference'
  _ref: string
  _weak?: boolean
}

export type ContentLinkValue = {
  _type?: 'contentLink'
  linkType?: ContentLinkType | null
  internalReference?: ContentLinkReference | null
  internalPath?: string | null
  externalUrl?: string | null
}

export type NavLinkProjection = {
  _type: 'siteNavLink'
  _id: string
  label?: string | null
  path?: string | null
  sitePage?: {
    _id: string
    title?: string | null
    slug?: string | null
  } | null
}

export type NavGroupProjection = {
  _type: 'siteNavGroup'
  _id: string
  label?: string | null
  items?: NavLinkProjection[] | null
}

export type SiteNavigationProjection = {
  entries?: (NavLinkProjection | NavGroupProjection | null)[] | null
}

export type PublishedPageProjection = {
  _id: string
  title?: string | null
  slug?: string | null
}

export type PublishedPostProjection = {
  _id: string
  title?: string | null
  slug?: string | null
  publishedAt?: string | null
}

export const SITE_NAVIGATION_HIERARCHY_QUERY = `*[_type == "siteNavigation" && _id == "siteNavigation"][0]{
  entries[]->{
    _type,
    _id,
    label,
    path,
    sitePage->{
      _id,
      title,
      "slug": slug.current
    },
    items[]->{
      _id,
      label,
      path,
      sitePage->{
        _id,
        title,
        "slug": slug.current
      }
    }
  }
}`

export const PUBLISHED_SITE_PAGES_QUERY = `*[_type == "sitePage" && !(_id in path("drafts.**"))] | order(title asc) {
  _id,
  title,
  "slug": slug.current
}`

export const PUBLISHED_NEWS_POSTS_QUERY = `*[_type == "newsPost" && !(_id in path("drafts.**"))] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  publishedAt
}`

export function normalizeInternalPath(path: string): string {
  const trimmed = path.trim()
  if (!trimmed) {
    return ''
  }
  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`
}

export function isNewsHubPath(path: string | null | undefined): boolean {
  if (!path) {
    return false
  }
  return normalizeInternalPath(path) === NEWS_HUB_PATH
}

export function hrefForSitePageSlug(slug: string | null | undefined): string | null {
  const value = slug?.trim()
  if (!value) {
    return null
  }
  return normalizeInternalPath(value)
}

export function hrefForNewsPostSlug(slug: string | null | undefined): string | null {
  const value = slug?.trim()
  if (!value) {
    return null
  }
  return `${NEWS_HUB_PATH}/${value.replace(/^\/+/, '')}`
}

/** Schema-level validation shared by the `contentLink` object type. */
export function validateContentLinkValue(fields: unknown): true | string {
  if (!fields || typeof fields !== 'object') {
    return true
  }

  const value = fields as ContentLinkValue
  const linkType =
    value.linkType === 'external' ? 'external' : value.linkType === 'internal' ? 'internal' : null
  const ref = value.internalReference?._ref?.trim() ?? ''
  const path =
    typeof value.internalPath === 'string' ? normalizeInternalPath(value.internalPath) : ''
  const external = typeof value.externalUrl === 'string' ? value.externalUrl.trim() : ''

  // Optional CTA: fully empty object is valid (button hidden on the site).
  if (!linkType && !ref && !path && !external) {
    return true
  }

  if (!linkType) {
    return 'Choose Internal or External'
  }

  if (linkType === 'internal') {
    if (ref && path) {
      return 'Use either a page/post reference or an internal path, not both'
    }
    if (!ref && !path) {
      return 'Choose an internal destination'
    }
    if (path && !path.startsWith('/')) {
      return 'Internal path must start with /'
    }
    if (external) {
      return 'Clear the external URL when using an internal link'
    }
    return true
  }

  if (!external) {
    return 'Enter a full external URL'
  }
  if (!/^https?:\/\//i.test(external)) {
    return 'External URL must start with http:// or https://'
  }
  if (ref || path) {
    return 'Clear the internal destination when using an external link'
  }
  return true
}

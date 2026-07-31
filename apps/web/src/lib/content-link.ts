/** GROQ fragment shape for `contentLink` objects. */
export type ContentLinkGroq = {
  linkType?: 'internal' | 'external' | 'email' | null
  internalPath?: string | null
  externalUrl?: string | null
  emailAddress?: string | null
  internalReference?: {
    _type?: string | null
    postType?: string | null
    slug?: {current?: string | null} | null
  } | null
}

/** Portable Text link mark value (contentLink fields + optional legacy `href`). */
export type PortableTextLinkValue = ContentLinkGroq & {
  _type: string
  _key?: string
  href?: string | null
}

export type ResolvedContentLink = {
  href: string
  external: boolean
}

function normalizeInternalPath(path: string): string {
  const p = path.trim()
  if (!p) {
    return ''
  }
  return p.startsWith('/') ? p : `/${p}`
}

function hrefForInternalReference(ref: ContentLinkGroq['internalReference']): string | null {
  if (!ref) {
    return null
  }
  // News posts are external hub cards only — no on-site slug page.
  if (ref._type === 'newsPost' && ref.postType === 'news') {
    return null
  }
  const slug = ref.slug?.current?.trim()
  if (!slug) {
    return null
  }
  if (ref._type === 'newsPost') {
    return `/news-and-updates/${slug.replace(/^\/+/, '')}`
  }
  return normalizeInternalPath(slug)
}

/**
 * Resolves a CTA/card `contentLink` to href + external flag.
 * External behavior comes from `linkType`, not URL sniffing.
 */
export function resolveContentLink(
  target: ContentLinkGroq | null | undefined,
): ResolvedContentLink | null {
  if (!target) {
    return null
  }

  if (target.linkType === 'external') {
    const href = target.externalUrl?.trim()
    if (!href || !/^https?:\/\//i.test(href)) {
      return null
    }
    return {href, external: true}
  }

  if (target.linkType === 'email') {
    const emailAddress = target.emailAddress?.trim()
    if (!emailAddress || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress)) {
      return null
    }
    return {href: `mailto:${emailAddress}`, external: false}
  }

  if (target.linkType !== 'internal') {
    return null
  }

  const fromRef = hrefForInternalReference(target.internalReference)
  if (fromRef) {
    return {href: fromRef, external: false}
  }

  const path = target.internalPath?.trim()
  if (path) {
    return {href: normalizeInternalPath(path), external: false}
  }

  return null
}

/**
 * Resolves a Portable Text link mark.
 * Prefer `contentLink` fields; fall back to legacy `href` until PT content is re-saved.
 */
export function resolvePortableTextLink(
  value: PortableTextLinkValue | null | undefined,
): ResolvedContentLink | null {
  const primary = resolveContentLink(value)
  if (primary) {
    return primary
  }

  const href = value?.href?.trim()
  if (!href) {
    return null
  }
  if (/^https?:\/\//i.test(href)) {
    return {href, external: true}
  }
  if (/^mailto:[^\s@]+@[^\s@]+\.[^\s@]+$/i.test(href)) {
    return {href, external: false}
  }
  return {href, external: false}
}

/** GROQ projection for `contentLink` fields. */
export const CONTENT_LINK_GROQ = `{
  linkType,
  internalPath,
  externalUrl,
  emailAddress,
  internalReference->{
    _type,
    postType,
    slug
  }
}`

/** Expands link markDefs so internal references resolve for Portable Text. */
export const PT_MARK_DEFS_GROQ = `markDefs[]{
  ...,
  internalReference->{
    _type,
    postType,
    slug
  }
}`

/** Portable Text block array projection with resolved link marks. */
export const PT_BLOCKS_GROQ = `{
  ...,
  ${PT_MARK_DEFS_GROQ}
}`

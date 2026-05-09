/** GROQ fragment shape for `homepageLinkTarget` objects. */
export type HomepageLinkTargetGroq = {
  path?: string | null
  externalUrl?: string | null
  sitePage?: {slug?: {current?: string | null} | null} | null
}

function normalizeInternalPath(path: string): string {
  const p = path.trim()
  if (!p) {
    return ''
  }
  return p.startsWith('/') ? p : `/${p}`
}

/**
 * Resolves CTA/card link to an absolute or root-relative URL string, or null if invalid.
 */
export function resolveHomepageLinkHref(
  target: HomepageLinkTargetGroq | null | undefined,
): string | null {
  if (!target) {
    return null
  }
  const ext = target.externalUrl?.trim()
  if (ext) {
    return ext
  }
  const slug = target.sitePage?.slug?.current?.trim()
  if (slug) {
    return normalizeInternalPath(slug)
  }
  const path = target.path?.trim()
  if (path) {
    return normalizeInternalPath(path)
  }
  return null
}

/**
 * Donorbox embed helpers.
 *
 * The CMS field may hold either a bare campaign slug (`pedp`) or a full Donorbox
 * embed URL. When an editor pastes the full embed URL we preserve its query
 * params (e.g. `donor_wall_color`, `only_donor_wall`) so Donorbox styling is
 * kept. We never store or render raw embed HTML/script from the CMS.
 */

const DONORBOX_HOST = 'donorbox.org'

/** Placeholder slug until editors paste the real campaign. */
export const DONORBOX_CAMPAIGN_PLACEHOLDER = 'REPLACE_WITH_CAMPAIGN_SLUG'

export function donorboxWidgetScriptSrc(): string {
  return `https://${DONORBOX_HOST}/widget.js`
}

function isHttpUrl(value: string): boolean {
  return /^https?:\/\//i.test(value)
}

function isDonorboxHost(hostname: string): boolean {
  return hostname === DONORBOX_HOST || hostname.endsWith(`.${DONORBOX_HOST}`)
}

/**
 * Extract a campaign slug from editor input.
 * Accepts: `pedp`, `https://donorbox.org/embed/pedp`, `https://donorbox.org/pedp`, etc.
 */
export function normalizeDonorboxCampaign(raw: string | null | undefined): string | null {
  const trimmed = typeof raw === 'string' ? raw.trim() : ''
  if (!trimmed) {
    return null
  }

  if (!isHttpUrl(trimmed)) {
    const parts = trimmed.split('/').filter(Boolean)
    const slug = parts[parts.length - 1]?.split('?')[0]?.trim()
    return slug || null
  }

  try {
    const url = new URL(trimmed)
    if (!isDonorboxHost(url.hostname)) {
      return null
    }
    const segments = url.pathname.split('/').filter(Boolean)
    const embedIndex = segments.findIndex((segment) => segment === 'embed')
    if (embedIndex >= 0 && segments[embedIndex + 1]) {
      return segments[embedIndex + 1] ?? null
    }
    const last = segments[segments.length - 1]
    return last || null
  } catch {
    return null
  }
}

export type DonorboxEmbedKind = 'form' | 'wall'

export type DonorboxEmbedResolution = {
  src: string
  isPlaceholder: boolean
}

function slugEmbedUrl(campaign: string, kind: DonorboxEmbedKind): string {
  const url = new URL(`https://${DONORBOX_HOST}/embed/${encodeURIComponent(campaign)}`)
  if (kind === 'wall') {
    url.searchParams.set('only_donor_wall', 'true')
  }
  return url.toString()
}

/**
 * Resolve the CMS value to a safe Donorbox embed `src`.
 *
 * - Full Donorbox URL: kept as-is (host validated), query params preserved.
 *   For the wall we ensure `only_donor_wall=true` is present.
 * - Bare slug: build the canonical embed URL, adding `only_donor_wall=true`
 *   for the wall.
 * - Anything else (empty / non-Donorbox / placeholder): treated as placeholder.
 */
export function resolveDonorboxEmbed(
  raw: string | null | undefined,
  kind: DonorboxEmbedKind,
): DonorboxEmbedResolution {
  const trimmed = typeof raw === 'string' ? raw.trim() : ''

  if (trimmed && isHttpUrl(trimmed)) {
    try {
      const url = new URL(trimmed)
      if (isDonorboxHost(url.hostname) && url.pathname.includes('/embed/')) {
        if (kind === 'wall') {
          url.searchParams.set('only_donor_wall', 'true')
        }
        return {src: url.toString(), isPlaceholder: false}
      }
    } catch {
      // fall through to slug handling
    }
  }

  const slug = normalizeDonorboxCampaign(trimmed)
  if (slug && slug !== DONORBOX_CAMPAIGN_PLACEHOLDER) {
    return {src: slugEmbedUrl(slug, kind), isPlaceholder: false}
  }

  return {src: slugEmbedUrl(DONORBOX_CAMPAIGN_PLACEHOLDER, kind), isPlaceholder: true}
}

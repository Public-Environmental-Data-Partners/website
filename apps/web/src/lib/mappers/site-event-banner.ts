import {type ContentLinkGroq, resolveContentLink} from '@/lib/content-link'

export const SITE_EVENT_BANNER_PLACEMENTS = ['aboveHeader', 'belowHeader', 'aboveFooter'] as const

export type SiteEventBannerPlacement = (typeof SITE_EVENT_BANNER_PLACEMENTS)[number]

export type SiteEventBannerProps = {
  sectionHeading: string
  heading: string
  placement: SiteEventBannerPlacement
  /** Omit when no destination — button hidden. */
  ctaLabel?: string
  ctaHref?: string
  /** True when CTA is an external contentLink. */
  ctaExternal?: boolean
}

export type SiteEventBannerFields = {
  sectionHeading?: string | null
  heading?: string | null
  placement?: string | null
  startsAt?: string | null
  endsAt?: string | null
  ctaLabel?: string | null
  ctaLink?: ContentLinkGroq | null
}

export function isSiteEventBannerPlacement(value: unknown): value is SiteEventBannerPlacement {
  return (
    typeof value === 'string' && (SITE_EVENT_BANNER_PLACEMENTS as readonly string[]).includes(value)
  )
}

/** Inclusive start/end window. Invalid timestamps hide the banner. */
export function isWithinEventWindow(startsAt: string, endsAt: string, now: Date): boolean {
  const start = Date.parse(startsAt)
  const end = Date.parse(endsAt)
  if (Number.isNaN(start) || Number.isNaN(end) || end <= start) {
    return false
  }
  const t = now.getTime()
  return t >= start && t <= end
}

export function mapSiteEventBannerToProps(
  data: SiteEventBannerFields | null | undefined,
  now: Date,
): SiteEventBannerProps | null {
  if (!data) {
    return null
  }
  const sectionHeading = data.sectionHeading?.trim()
  const heading = data.heading?.trim()
  const startsAt = data.startsAt?.trim()
  const endsAt = data.endsAt?.trim()
  if (!sectionHeading || !heading || !startsAt || !endsAt) {
    return null
  }
  if (!isSiteEventBannerPlacement(data.placement)) {
    return null
  }
  if (!isWithinEventWindow(startsAt, endsAt, now)) {
    return null
  }

  const resolved = resolveContentLink(data.ctaLink)
  const ctaHref = resolved?.href
  const ctaLabel = ctaHref ? data.ctaLabel?.trim() || 'Sign-up' : undefined

  return {
    sectionHeading,
    heading,
    placement: data.placement,
    ...(ctaHref && ctaLabel ? {ctaLabel, ctaHref, ctaExternal: resolved?.external === true} : {}),
  }
}

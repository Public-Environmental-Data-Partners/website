import {type ContentLinkGroq, resolveContentLink} from '@/lib/content-link'
import {pickSectionHeadingFromKicker} from '@/lib/mappers/content-field-compat'

type SanityImageData = {
  alt?: string | null
  asset?: {
    url?: string | null
    metadata?: {
      dimensions?: {width?: number | null; height?: number | null} | null
    } | null
  } | null
} | null

export type HighlightBannerSectionProps = {
  sectionHeading: string
  heading: string
  body: unknown[]
  /** Omit when no destination — button hidden. */
  ctaLabel?: string
  ctaHref?: string
  /** True when CTA is an external contentLink. */
  ctaExternal?: boolean
  image: {
    src: string
    alt: string
    width?: number
    height?: number
  }
}

export type HighlightBannerSectionFields = {
  sectionHeading?: string | null
  /** Legacy section label. */
  kicker?: string | null
  titleLine?: string | null
  heading?: string | null
  body?: unknown[] | null
  ctaLabel?: string | null
  ctaLink?: ContentLinkGroq | null
  image?: SanityImageData
}

function mapBannerImage(
  image: SanityImageData,
  fallbackAlt: string,
): HighlightBannerSectionProps['image'] | null {
  const src = image?.asset?.url
  if (!src) {
    return null
  }
  const dimensions = image.asset?.metadata?.dimensions
  return {
    src,
    alt: image.alt?.trim() || fallbackAlt,
    width: dimensions?.width ?? undefined,
    height: dimensions?.height ?? undefined,
  }
}

export function mapHighlightBannerSectionToProps(
  data: HighlightBannerSectionFields | null | undefined,
): HighlightBannerSectionProps | null {
  const sectionHeading = pickSectionHeadingFromKicker(data ?? {})
  const heading = data?.heading?.trim()
  if (!sectionHeading || !heading) {
    return null
  }
  const body = Array.isArray(data?.body) ? data.body : []
  if (body.length === 0) {
    return null
  }
  const image = mapBannerImage(data?.image ?? null, heading)
  if (!image) {
    return null
  }

  const resolved = resolveContentLink(data?.ctaLink)
  const ctaHref = resolved?.href
  const ctaLabel = ctaHref ? data?.ctaLabel?.trim() || 'Explore' : undefined

  return {
    sectionHeading,
    heading,
    body,
    image,
    ...(ctaHref && ctaLabel ? {ctaLabel, ctaHref, ctaExternal: resolved?.external === true} : {}),
  }
}

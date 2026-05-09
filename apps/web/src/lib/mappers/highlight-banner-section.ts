import type {HomepageLinkTargetGroq} from '@/lib/mappers/homepage-link-target'
import {resolveHomepageLinkHref} from '@/lib/mappers/homepage-link-target'

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
  kicker: string
  titleLine?: string
  heading: string
  body: unknown[]
  ctaLabel: string
  ctaHref: string
  image: {
    src: string
    alt: string
    width?: number
    height?: number
  }
}

export type HighlightBannerSectionFields = {
  kicker?: string | null
  titleLine?: string | null
  heading?: string | null
  body?: unknown[] | null
  ctaLabel?: string | null
  ctaLink?: HomepageLinkTargetGroq | null
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
  const kicker = data?.kicker?.trim()
  const heading = data?.heading?.trim()
  const ctaLabel = data?.ctaLabel?.trim()
  if (!kicker || !heading || !ctaLabel) {
    return null
  }
  const ctaHref = resolveHomepageLinkHref(data?.ctaLink)
  if (!ctaHref) {
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
  const titleLine = data?.titleLine?.trim()
  return {
    kicker,
    heading,
    body,
    ctaLabel,
    ctaHref,
    image,
    ...(titleLine ? {titleLine} : {}),
  }
}

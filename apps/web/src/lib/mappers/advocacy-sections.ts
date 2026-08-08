import type {PortableTextBlock} from '@portabletext/react'

import type {HeroImage} from '@/components/hero/hero-image'
import {type ContentLinkGroq, resolveContentLink} from '@/lib/content-link'
import {
  type ImageShelfSettings,
  type ImageShelfSettingsFields,
  mapImageShelfSettings,
} from '@/lib/mappers/image-shelf'
import {mapSanityImage, type SanityImageData} from '@/lib/mappers/sanity-image'

function toPortableTextBlocks(value: unknown): PortableTextBlock[] {
  return Array.isArray(value) ? (value as PortableTextBlock[]) : []
}

export type AdvocacyHeroProps = {
  /** Page title used as the uppercase eyebrow / accessible h1. */
  pageTitle: string
  heading: string
  body: PortableTextBlock[]
  image?: HeroImage
  imageShelf: ImageShelfSettings
  cardHeading: string
  cardBody: PortableTextBlock[]
  ctaLabel?: string
  href?: string
  external?: boolean
}

export type AdvocacyHeroFields = {
  heading?: string | null
  body?: unknown
  image?: SanityImageData
  imageShelf?: ImageShelfSettingsFields | null
  cardHeading?: string | null
  cardBody?: unknown
  showCta?: boolean | null
  ctaLabel?: string | null
  ctaLink?: ContentLinkGroq | null
}

export function mapAdvocacyHeroToProps(
  data: AdvocacyHeroFields | null | undefined,
  pageTitle: string,
): AdvocacyHeroProps | null {
  const heading = data?.heading?.trim()
  const body = toPortableTextBlocks(data?.body)
  const cardHeading = data?.cardHeading?.trim()
  const cardBody = toPortableTextBlocks(data?.cardBody)
  const title = pageTitle.trim()
  if (!heading || body.length === 0 || !cardHeading || cardBody.length === 0 || !title) {
    return null
  }

  const image = mapSanityImage(data?.image ?? null, '')
  const showCta = data?.showCta === true
  const ctaLabel = data?.ctaLabel?.trim() || undefined
  const resolved = showCta ? resolveContentLink(data?.ctaLink) : null

  return {
    pageTitle: title,
    heading,
    body,
    image: image ?? undefined,
    imageShelf: mapImageShelfSettings(data?.imageShelf),
    cardHeading,
    cardBody,
    ...(showCta && resolved && ctaLabel
      ? {ctaLabel, href: resolved.href, external: resolved.external}
      : {}),
  }
}

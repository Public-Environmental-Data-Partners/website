import type {PortableTextBlock} from '@portabletext/react'

import type {HomeHeroSectionProps} from '@/components/home/hero-section'
import {type ContentLinkGroq, resolveContentLink} from '@/lib/content-link'
import {type ImageShelfSettingsFields, mapImageShelfSettings} from '@/lib/mappers/image-shelf'

import {mapSanityImage, type SanityImageData} from './sanity-image'

/** Sanity fragment shape for `homeHero` section block. */
export type HomeHeroFields = {
  heroHeading?: string | null
  heroParagraph1?: unknown
  heroParagraph2?: unknown
  heroParagraph3?: unknown
  primaryCtaLabel?: string | null
  primaryCtaLink?: ContentLinkGroq | null
  secondaryCtaLabel?: string | null
  secondaryCtaLink?: ContentLinkGroq | null
  heroImage?: SanityImageData
  imageShelf?: ImageShelfSettingsFields | null
}

function mapHeroCta(
  label: string | null | undefined,
  link: ContentLinkGroq | null | undefined,
): HomeHeroSectionProps['primaryCta'] {
  const text = label?.trim()
  const resolved = resolveContentLink(link)
  if (!text || !resolved) {
    return undefined
  }
  return {label: text, href: resolved.href, external: resolved.external}
}

function toPortableTextBlocks(value: unknown): PortableTextBlock[] {
  return Array.isArray(value) ? (value as PortableTextBlock[]) : []
}

export function mapHeroBlockToProps(
  data: HomeHeroFields | null | undefined,
): HomeHeroSectionProps | null {
  const title = data?.heroHeading?.trim()
  if (!title) {
    return null
  }

  const paragraph1 = toPortableTextBlocks(data?.heroParagraph1)
  if (paragraph1.length === 0) {
    return null
  }

  const image = mapSanityImage(data?.heroImage ?? null, title)
  if (!image) {
    return null
  }

  const paragraph2 = toPortableTextBlocks(data?.heroParagraph2)
  const paragraph3 = toPortableTextBlocks(data?.heroParagraph3)

  return {
    title,
    paragraph1,
    paragraph2: paragraph2.length > 0 ? paragraph2 : undefined,
    paragraph3: paragraph3.length > 0 ? paragraph3 : undefined,
    primaryCta: mapHeroCta(data?.primaryCtaLabel, data?.primaryCtaLink),
    secondaryCta: mapHeroCta(data?.secondaryCtaLabel, data?.secondaryCtaLink),
    image,
    imageShelf: mapImageShelfSettings(data?.imageShelf),
  }
}

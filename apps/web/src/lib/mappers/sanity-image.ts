import type {SanityImageSource} from '@sanity/image-url'

import type {HeroImage} from '@/components/hero/hero-image'
import {buildSanityImageUrl} from '@/lib/sanity-image-url'

export type SanityImageHotspot = {
  x?: number
  y?: number
  height?: number
  width?: number
}

export type SanityImageCrop = {
  top?: number
  bottom?: number
  left?: number
  right?: number
}

export type SanityImageData = {
  alt?: string | null
  credit?: string | null
  hotspot?: SanityImageHotspot | null
  crop?: SanityImageCrop | null
  asset?: {
    _id?: string | null
    url?: string | null
    metadata?: {
      dimensions?: {
        width?: number | null
        height?: number | null
      } | null
    } | null
  } | null
} | null

/** Hero upload spec: 3:2 @ min 1900px wide (docs/blog-components.md). */
export const ARTICLE_HERO_IMAGE_WIDTH = 1900
export const ARTICLE_HERO_IMAGE_HEIGHT = 1267

export const ARTICLE_HERO_IMAGE_SIZES =
  '(max-width: 767px) calc(100vw - 32px), (max-width: 1023px) calc(100vw - 64px), 925px'

function hasImageAsset(image: SanityImageData): image is NonNullable<SanityImageData> {
  return Boolean(image?.asset?._id || image?.asset?.url)
}

function toImageSource(image: NonNullable<SanityImageData>): SanityImageSource {
  return image as SanityImageSource
}

export function mapSanityImage(image: SanityImageData, fallbackAlt = ''): HeroImage | undefined {
  if (!hasImageAsset(image)) {
    return undefined
  }

  const dimensions = image.asset?.metadata?.dimensions
  return {
    src: image.asset?.url ?? '',
    alt: image.alt?.trim() || fallbackAlt,
    width: dimensions?.width ?? undefined,
    height: dimensions?.height ?? undefined,
  }
}

/** Hotspot-aware article hero crop via Sanity CDN (docs/blog-components.md). */
export function mapSanityArticleHeroImage(
  image: SanityImageData,
  fallbackAlt = '',
): HeroImage | undefined {
  if (!hasImageAsset(image)) {
    return undefined
  }

  const alt = image.alt?.trim() || fallbackAlt
  const src =
    buildSanityImageUrl(toImageSource(image), {
      width: ARTICLE_HERO_IMAGE_WIDTH,
      height: ARTICLE_HERO_IMAGE_HEIGHT,
    }) ?? image.asset?.url

  if (!src) {
    return undefined
  }

  return {
    src,
    alt,
    width: ARTICLE_HERO_IMAGE_WIDTH,
    height: ARTICLE_HERO_IMAGE_HEIGHT,
  }
}

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

/** Hero upload spec: 3:2 @ min 1900px wide (docs/architecture/article-components.md). */
export const ARTICLE_HERO_IMAGE_WIDTH = 1900
export const ARTICLE_HERO_IMAGE_HEIGHT = 1267

/** Open Graph / social share crop (~1.91:1). Derived from hero via Sanity CDN. */
export const SHARE_IMAGE_WIDTH = 1200
export const SHARE_IMAGE_HEIGHT = 630

export const ARTICLE_HERO_IMAGE_SIZES =
  '(max-width: 767px) calc(100vw - 32px), (max-width: 1023px) calc(100vw - 64px), 925px'

function hasImageAsset(image: SanityImageData): image is NonNullable<SanityImageData> {
  return Boolean(image?.asset?._id || image?.asset?.url)
}

/** @public — article figure mappers */
export function hasSanityImageAsset(image: SanityImageData): image is NonNullable<SanityImageData> {
  return hasImageAsset(image)
}

function toImageSource(image: NonNullable<SanityImageData>): SanityImageSource {
  return image as SanityImageSource
}

/** @public — article figure mappers */
export function toSanityImageSource(image: NonNullable<SanityImageData>): SanityImageSource {
  return toImageSource(image)
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

/** Hotspot-aware article hero crop via Sanity CDN (docs/architecture/article-components.md). */
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

/** Hotspot-aware OG / link-preview crop from the article hero image. */
export function mapSanityShareImage(
  image: SanityImageData,
  fallbackAlt = '',
): {src: string; alt: string; width: number; height: number} | undefined {
  if (!hasImageAsset(image)) {
    return undefined
  }

  const alt = image.alt?.trim() || fallbackAlt
  const src =
    buildSanityImageUrl(toImageSource(image), {
      width: SHARE_IMAGE_WIDTH,
      height: SHARE_IMAGE_HEIGHT,
    }) ?? image.asset?.url

  if (!src) {
    return undefined
  }

  return {
    src,
    alt,
    width: SHARE_IMAGE_WIDTH,
    height: SHARE_IMAGE_HEIGHT,
  }
}

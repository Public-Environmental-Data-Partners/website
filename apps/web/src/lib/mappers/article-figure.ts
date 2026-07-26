import type {SanityImageSource} from '@sanity/image-url'

import type {HeroImage} from '@/components/hero/hero-image'
import {
  hasSanityImageAsset,
  type SanityImageData,
  toSanityImageSource,
} from '@/lib/mappers/sanity-image'
import {buildSanityImageUrl} from '@/lib/sanity-image-url'

/** In-body figure display ratio (docs/architecture/article-components.md). */
export const ARTICLE_FIGURE_ASPECT_WIDTH = 4
export const ARTICLE_FIGURE_ASPECT_HEIGHT = 3

/** CDN target widths per grid context @ ~4:3. */
export type ArticleFigureImageSize = 'single10' | 'duo6' | 'imageText4' | 'imageText6'

const ARTICLE_FIGURE_WIDTH: Record<ArticleFigureImageSize, number> = {
  single10: 1163,
  duo6: 688,
  imageText4: 450,
  imageText6: 340,
}

export function articleFigureDisplayHeight(width: number): number {
  return Math.round((width * ARTICLE_FIGURE_ASPECT_HEIGHT) / ARTICLE_FIGURE_ASPECT_WIDTH)
}

export const ARTICLE_FIGURE_IMAGE_SIZES: Record<ArticleFigureImageSize, string> = {
  single10:
    '(max-width: 1023px) 100vw, (max-width: 89.9375rem) calc((min(100vw, 87.5rem) - 2.5rem) * 10 / 12)',
  duo6: '(max-width: 767px) 100vw, (max-width: 1023px) calc((100vw - 4rem - 1.5rem) / 2), 688px',
  imageText4:
    '(max-width: 1023px) calc((100vw - 4rem - 1.5rem) / 2), calc((min(100vw, 87.5rem) - 2.5rem) * 4 / 12)',
  imageText6:
    '(max-width: 767px) calc((100vw - 2rem - 1.5rem) / 2), calc((100vw - 4rem - 1.5rem) / 2)',
}

/** Hotspot-aware 4:3 crop for article body figures. */
export function mapSanityArticleFigureImage(
  image: SanityImageData,
  size: ArticleFigureImageSize,
  fallbackAlt = '',
): HeroImage | undefined {
  if (!hasSanityImageAsset(image)) {
    return undefined
  }

  const width = ARTICLE_FIGURE_WIDTH[size]
  const height = articleFigureDisplayHeight(width)
  const alt = image.alt?.trim() || fallbackAlt
  const source: SanityImageSource = toSanityImageSource(image)
  const src = buildSanityImageUrl(source, {width, height}) ?? image.asset?.url

  if (!src) {
    return undefined
  }

  return {src, alt, width, height}
}

export type {SanityImageData} from '@/lib/mappers/sanity-image'

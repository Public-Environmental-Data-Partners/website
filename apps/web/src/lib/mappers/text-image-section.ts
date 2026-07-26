import type {PortableTextBlock} from '@portabletext/react'

import type {HeroImage} from '@/components/hero/hero-image'
import {
  hasSanityImageAsset,
  type SanityImageData,
  toSanityImageSource,
} from '@/lib/mappers/sanity-image'
import {buildSanityImageUrl} from '@/lib/sanity-image-url'

export type TextImagePosition = 'left' | 'right'

/** Illustration frame is 4:3; request the CDN crop at the Studio upload minimum. */
const TEXT_IMAGE_WIDTH = 900
const TEXT_IMAGE_HEIGHT = 675

/** Full width up to tablet; desktop image is 5–6 of 12 columns inside the 1400px shell. */
export const TEXT_IMAGE_SIZES =
  '(max-width: 1023px) calc(100vw - 2rem), calc((min(100vw, 87.5rem) - 2.5rem) * 6 / 12)'

export type TextImageSectionProps = {
  body: PortableTextBlock[]
  /** Omit for a text-only row. */
  image?: HeroImage
  imagePosition: TextImagePosition
}

export type TextImageSectionFields = {
  body?: unknown
  image?: SanityImageData
  imagePosition?: string | null
}

function toPortableTextBlocks(value: unknown): PortableTextBlock[] {
  return Array.isArray(value) ? (value as PortableTextBlock[]) : []
}

/** Hotspot-aware 4:3 crop for a text + image row illustration. */
function mapTextImageIllustration(image: SanityImageData): HeroImage | undefined {
  if (!hasSanityImageAsset(image)) {
    return undefined
  }

  const src =
    buildSanityImageUrl(toSanityImageSource(image), {
      width: TEXT_IMAGE_WIDTH,
      height: TEXT_IMAGE_HEIGHT,
    }) ?? image.asset?.url

  if (!src) {
    return undefined
  }

  return {
    src,
    alt: image.alt?.trim() || '',
    width: TEXT_IMAGE_WIDTH,
    height: TEXT_IMAGE_HEIGHT,
  }
}

export function mapTextImageSectionToProps(
  data: TextImageSectionFields | null | undefined,
): TextImageSectionProps | null {
  const body = toPortableTextBlocks(data?.body)
  if (body.length === 0) {
    return null
  }

  const image = mapTextImageIllustration(data?.image ?? null)
  const imagePosition: TextImagePosition = data?.imagePosition === 'left' ? 'left' : 'right'

  return {
    body,
    imagePosition,
    ...(image ? {image} : {}),
  }
}

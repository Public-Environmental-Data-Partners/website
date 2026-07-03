import {createImageUrlBuilder, type SanityImageSource} from '@sanity/image-url'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET

const builder = projectId && dataset ? createImageUrlBuilder({projectId, dataset}) : null

export type SanityImageUrlOptions = {
  width: number
  height: number
  quality?: number
}

/** CDN URL with crop + hotspot when present on the Sanity image object. */
export function buildSanityImageUrl(
  source: SanityImageSource,
  {width, height, quality = 80}: SanityImageUrlOptions,
): string | undefined {
  if (!builder) {
    return undefined
  }

  return builder
    .image(source)
    .width(width)
    .height(height)
    .fit('crop')
    .auto('format')
    .quality(quality)
    .url()
}

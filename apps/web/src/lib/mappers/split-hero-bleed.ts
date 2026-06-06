import type {SplitHeroBleedSectionProps} from '@/components/sections/split-hero-bleed-section'

import {mapSanityImage, type SanityImageData} from './sanity-image'

export type SplitHeroBleedFields = {
  eyebrow?: string | null
  title?: string | null
  body?: unknown
  image?: SanityImageData
  imageMobile?: SanityImageData
  hideImageOnMobile?: boolean | null
}

function toPortableTextArray(value: unknown) {
  return Array.isArray(value) ? value : []
}

export function mapSplitHeroBleed(
  data: SplitHeroBleedFields | null | undefined,
): SplitHeroBleedSectionProps | null {
  const title = data?.title?.trim()
  if (!title) {
    return null
  }

  const image = mapSanityImage(data?.image ?? null, title)
  if (!image) {
    return null
  }

  const imageMobile = mapSanityImage(data?.imageMobile ?? null, image.alt || title)
  const body = toPortableTextArray(data?.body)

  return {
    eyebrow: data?.eyebrow?.trim() || undefined,
    title,
    body: body.length > 0 ? body : undefined,
    image,
    imageMobile,
    hideImageOnMobile: Boolean(data?.hideImageOnMobile),
  }
}

import type {HeroSectionProps} from '@/components/home/hero-section'

import {mapSanityImage, type SanityImageData} from './sanity-image'

/** Sanity fragment shape for homepage hero (flat doc or `homeHero` section block). */
export type HomeHeroFields = {
  heroKicker?: string | null
  heroHeading?: string | null
  heroParagraph1?: unknown
  heroParagraph2?: unknown
  heroImage?: SanityImageData
  heroImageMobile?: SanityImageData
  hideHeroImageOnMobile?: boolean | null
  homePageStyle?: boolean | null
}

function toPortableTextArray(value: unknown) {
  return Array.isArray(value) ? value : []
}

export function mapHeroBlockToProps(
  data: HomeHeroFields | null | undefined,
): HeroSectionProps | null {
  const title = data?.heroHeading?.trim()
  if (!title) {
    return null
  }

  const paragraph1 = toPortableTextArray(data?.heroParagraph1)
  const paragraph2 = toPortableTextArray(data?.heroParagraph2)
  const body = [...paragraph1, ...paragraph2]

  const image = mapSanityImage(data?.heroImage ?? null, title)
  if (!image) {
    return null
  }
  const imageMobile = mapSanityImage(data?.heroImageMobile ?? null, image.alt || title)

  return {
    eyebrow: data?.heroKicker?.trim() || undefined,
    title,
    body: body.length > 0 ? body : undefined,
    image,
    imageMobile,
    hideImageOnMobile: Boolean(data?.hideHeroImageOnMobile),
    // Undefined = legacy blocks (homepage) before the field existed; treat as home layout until migrated.
    homePageStyle: data?.homePageStyle !== false,
  }
}

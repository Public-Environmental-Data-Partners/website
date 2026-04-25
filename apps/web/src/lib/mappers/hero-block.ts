import type {HeroSectionProps} from '@/components/home/hero-section'

type SanityImageData = {
  alt?: string | null
  asset?: {
    url?: string | null
    metadata?: {
      dimensions?: {
        width?: number | null
        height?: number | null
      } | null
    } | null
  } | null
} | null

type HomeHeroSource = {
  heroKicker?: string | null
  heroHeading?: string | null
  heroParagraph1?: unknown
  heroParagraph2?: unknown
  heroImage?: SanityImageData
  heroImageMobile?: SanityImageData
  hideHeroImageOnMobile?: boolean | null
} | null

function mapHeroImage(image: SanityImageData, fallbackAlt = ''): HeroSectionProps['image'] {
  const src = image?.asset?.url
  if (!src) {
    return undefined
  }

  const dimensions = image.asset?.metadata?.dimensions
  return {
    src,
    alt: image.alt?.trim() || fallbackAlt,
    width: dimensions?.width ?? undefined,
    height: dimensions?.height ?? undefined,
  }
}

function toPortableTextArray(value: unknown) {
  return Array.isArray(value) ? value : []
}

export function mapHeroBlockToProps(data: HomeHeroSource): HeroSectionProps | null {
  const title = data?.heroHeading?.trim()
  if (!title) {
    return null
  }

  const paragraph1 = toPortableTextArray(data?.heroParagraph1)
  const paragraph2 = toPortableTextArray(data?.heroParagraph2)
  const body = [...paragraph1, ...paragraph2]

  const image = mapHeroImage(data?.heroImage ?? null, title)
  const imageMobile = mapHeroImage(data?.heroImageMobile ?? null, image?.alt || title)

  return {
    eyebrow: data?.heroKicker?.trim() || undefined,
    title,
    body: body.length > 0 ? body : undefined,
    image,
    imageMobile,
    hideImageOnMobile: Boolean(data?.hideHeroImageOnMobile),
  }
}

import type {HeroImage} from '@/components/hero/hero-image'

export type SanityImageData = {
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

export function mapSanityImage(image: SanityImageData, fallbackAlt = ''): HeroImage | undefined {
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

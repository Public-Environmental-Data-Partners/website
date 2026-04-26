import type {NewsUpdatesSectionProps} from '@/components/home/news-updates-section'

type SanityNewsCard = {
  title?: string | null
  excerpt?: string | null
  photoCredit?: string | null
  chip?: string | null
  route?: string | null
  image?: {
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
}

type NewsCardsSource = {
  newsUpdatesHeading?: string | null
  newsCards?: SanityNewsCard[] | null
} | null

export function mapNewsCardsToProps(data: NewsCardsSource): NewsUpdatesSectionProps | null {
  const cards = (data?.newsCards ?? [])
    .map((card) => {
      const title = card?.title?.trim()
      const href = card?.route?.trim()
      const imageSrc = card?.image?.asset?.url?.trim()
      const chip = card?.chip?.trim()
      if (!title || !href || !imageSrc || !chip) {
        return null
      }

      const dimensions = card.image?.asset?.metadata?.dimensions
      return {
        title,
        href,
        chip,
        excerpt: card.excerpt?.trim() || undefined,
        photoCredit: card.photoCredit?.trim() || undefined,
        imageSrc,
        imageAlt: card.image?.alt?.trim() || title,
        imageWidth: dimensions?.width ?? undefined,
        imageHeight: dimensions?.height ?? undefined,
      }
    })
    .filter((card): card is NonNullable<typeof card> => card !== null)

  if (cards.length === 0) {
    return null
  }

  return {
    heading: data?.newsUpdatesHeading?.trim() || 'News & Updates',
    cards,
  }
}

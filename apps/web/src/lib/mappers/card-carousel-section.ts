import type {HomepageLinkTargetGroq} from '@/lib/mappers/homepage-link-target'
import {resolveHomepageLinkHref} from '@/lib/mappers/homepage-link-target'

type SanityImageData = {
  alt?: string | null
  asset?: {
    url?: string | null
    metadata?: {
      dimensions?: {width?: number | null; height?: number | null} | null
    } | null
  } | null
} | null

export type StoryCardProps = {
  _type: 'storyCard'
  title: string
  photoCredit?: string
  href: string
  image: {
    src: string
    alt: string
    width?: number
    height?: number
  }
}

export type ToolCardProps = {
  _type: 'toolCard'
  title: string
  description?: string
  chip: string
  href: string
  image?: {
    src: string
    alt: string
    width?: number
    height?: number
  }
}

export type CardCarouselCardProps = StoryCardProps | ToolCardProps

export type CardCarouselSectionProps = {
  sectionHeading: string
  cards: CardCarouselCardProps[]
}

type StoryCardGroq = {
  _type: 'storyCard'
  _key: string
  title?: string | null
  photoCredit?: string | null
  authors?: string | null
  chip?: string | null
  link?: HomepageLinkTargetGroq | null
  image?: SanityImageData
}

type ToolCardGroq = {
  _type: 'toolCard'
  _key: string
  title?: string | null
  description?: string | null
  chip?: string | null
  link?: HomepageLinkTargetGroq | null
  image?: SanityImageData
}

export type CardCarouselSectionFields = {
  sectionHeading?: string | null
  cards?: Array<StoryCardGroq | ToolCardGroq | null> | null
}

function mapCardImage(
  image: SanityImageData,
  fallbackAlt: string,
): StoryCardProps['image'] | ToolCardProps['image'] | undefined {
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

export function mapCardCarouselSectionToProps(
  data: CardCarouselSectionFields | null | undefined,
): CardCarouselSectionProps | null {
  const sectionHeading = data?.sectionHeading?.trim()
  if (!sectionHeading) {
    return null
  }
  const cards: CardCarouselCardProps[] = []
  for (const card of data?.cards ?? []) {
    if (!card) {
      continue
    }
    const title = card.title?.trim()
    const href = resolveHomepageLinkHref(card.link)
    if (!title || !href) {
      continue
    }
    if (card._type === 'storyCard') {
      const image = mapCardImage(card.image ?? null, title)
      if (!image) {
        continue
      }
      const photoCredit = card.photoCredit?.trim()
      cards.push({
        _type: 'storyCard',
        title,
        href,
        image,
        ...(photoCredit ? {photoCredit} : {}),
      })
    } else if (card._type === 'toolCard') {
      const chip = card.chip?.trim()
      if (!chip) {
        continue
      }
      const image = mapCardImage(card.image ?? null, title)
      const description = card.description?.trim()
      cards.push({
        _type: 'toolCard',
        title,
        chip,
        href,
        ...(description ? {description} : {}),
        ...(image ? {image} : {}),
      })
    }
  }
  if (cards.length === 0) {
    return null
  }
  return {sectionHeading, cards}
}

import type {PortableTextBlock} from '@portabletext/react'

import {type BrandSvgPath, isBrandSvgPath} from '@/lib/brand-svgs'
import {type ContentLinkGroq, resolveContentLink} from '@/lib/content-link'
import {mapSanityImage, type SanityImageData} from '@/lib/mappers/sanity-image'

export type FocusAreaItemProps = {
  keyId: string
  /** Public path from Studio `brandSvg` (e.g. `/brand/coalition/data-db.svg`). */
  iconSrc: BrandSvgPath
  title: string
}

export type ToolsDevelopmentHeroProps = {
  sectionHeading: string
  heading: string
  body: PortableTextBlock[]
  focusAreasHeading: string
  focusAreas: FocusAreaItemProps[]
}

type FocusAreaItemFields = {
  _key?: string | null
  icon?: string | null
  title?: string | null
}

export type ToolsDevelopmentHeroFields = {
  sectionHeading?: string | null
  heading?: string | null
  body?: unknown
  focusAreasHeading?: string | null
  focusAreas?: FocusAreaItemFields[] | null
}

function toPortableTextBlocks(value: unknown): PortableTextBlock[] {
  return Array.isArray(value) ? (value as PortableTextBlock[]) : []
}

function mapFocusAreaItem(
  item: FocusAreaItemFields,
  index: number,
): FocusAreaItemProps | null {
  const title = item.title?.trim()
  const icon = typeof item.icon === 'string' ? item.icon.trim() : ''
  if (!title || !isBrandSvgPath(icon)) {
    return null
  }
  return {
    keyId: item._key?.trim() || `focus-area-${index}`,
    iconSrc: icon,
    title,
  }
}

export function mapToolsDevelopmentHeroToProps(
  data: ToolsDevelopmentHeroFields | null | undefined,
): ToolsDevelopmentHeroProps | null {
  const sectionHeading = data?.sectionHeading?.trim()
  const heading = data?.heading?.trim()
  const focusAreasHeading = data?.focusAreasHeading?.trim()
  const body = toPortableTextBlocks(data?.body)
  if (!sectionHeading || !heading || !focusAreasHeading || body.length === 0) {
    return null
  }

  const focusAreas = (Array.isArray(data?.focusAreas) ? data.focusAreas : [])
    .map((item, index) => mapFocusAreaItem(item, index))
    .filter((item): item is FocusAreaItemProps => item !== null)

  if (focusAreas.length === 0) {
    return null
  }

  return {sectionHeading, heading, body, focusAreasHeading, focusAreas}
}

export type ToolCardProps = {
  keyId: string
  title: string
  description: string
  version?: string
  pill?: string
  ctaLabel: string
  href: string
  external?: boolean
  image: {
    src: string
    alt: string
    width?: number
    height?: number
  }
}

export type ToolCategorySectionProps = {
  sectionHeading: string
  body: PortableTextBlock[]
  guidePrompt?: string
  guideCtaLabel?: string
  guideHref?: string
  guideExternal?: boolean
  cards: ToolCardProps[]
  headingId: string
}

type ToolCardFields = {
  _key?: string | null
  title?: string | null
  description?: string | null
  version?: string | null
  pill?: string | null
  ctaLabel?: string | null
  link?: ContentLinkGroq | null
  image?: SanityImageData
}

export type ToolCategorySectionFields = {
  sectionHeading?: string | null
  body?: unknown
  guidePrompt?: string | null
  guideCtaLabel?: string | null
  guideCtaLink?: ContentLinkGroq | null
  cards?: ToolCardFields[] | null
}

function mapToolCard(card: ToolCardFields, index: number): ToolCardProps | null {
  const title = card.title?.trim()
  const description = card.description?.trim()
  const ctaLabel = card.ctaLabel?.trim()
  const resolved = resolveContentLink(card.link)
  const image = mapSanityImage(card.image ?? null, title ?? '')
  if (!title || !description || !ctaLabel || !resolved || !image) {
    return null
  }

  const version = card.version?.trim()
  const pill = card.pill?.trim()

  return {
    keyId: card._key?.trim() || `tool-card-${index}`,
    title,
    description,
    ctaLabel,
    href: resolved.href,
    external: resolved.external,
    image: {
      src: image.src,
      alt: image.alt,
      width: image.width,
      height: image.height,
    },
    ...(version ? {version} : {}),
    ...(pill ? {pill} : {}),
  }
}

export function mapToolCategorySectionToProps(
  data: ToolCategorySectionFields | null | undefined,
  headingId: string,
): ToolCategorySectionProps | null {
  const sectionHeading = data?.sectionHeading?.trim()
  const body = toPortableTextBlocks(data?.body)
  if (!sectionHeading || body.length === 0) {
    return null
  }

  const cards = (Array.isArray(data?.cards) ? data.cards : [])
    .map((card, index) => mapToolCard(card, index))
    .filter((card): card is ToolCardProps => card !== null)

  const guidePrompt = data?.guidePrompt?.trim()
  const guideCtaLabel = data?.guideCtaLabel?.trim()
  const guideResolved = resolveContentLink(data?.guideCtaLink)

  return {
    sectionHeading,
    body,
    cards,
    headingId,
    ...(guidePrompt && guideCtaLabel && guideResolved
      ? {
          guidePrompt,
          guideCtaLabel,
          guideHref: guideResolved.href,
          guideExternal: guideResolved.external,
        }
      : {}),
  }
}

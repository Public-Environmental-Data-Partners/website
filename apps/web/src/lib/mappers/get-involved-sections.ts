import type {PortableTextBlock} from '@portabletext/react'

import type {HeroImage} from '@/components/hero/hero-image'
import type {ContactCtaBlock} from '@/components/site-page/contact-section'
import {type ContentLinkGroq, resolveContentLink} from '@/lib/content-link'
import {mapSanityImage, type SanityImageData} from '@/lib/mappers/sanity-image'

export type GetInvolvedIntroFields = {
  heading?: string | null
  callout?: Array<PortableTextBlock | ContactCtaBlock> | null
  image?: SanityImageData
  body?: PortableTextBlock[] | null
}

export type GetInvolvedIntroProps = {
  title: string
  heading: string
  callout: Array<PortableTextBlock | ContactCtaBlock>
  image: HeroImage
  body: PortableTextBlock[]
}

export type OtherWaysCardFields = {
  _key?: string | null
  icon?: SanityImageData
  title?: string | null
  body?: unknown
  ctaLabel?: string | null
  ctaLink?: ContentLinkGroq | null
}

export type OtherWaysSectionFields = {
  sectionHeading?: string | null
  cards?: OtherWaysCardFields[] | null
}

export type OtherWaysCardProps = {
  keyId: string
  icon: HeroImage
  title: string
  body: PortableTextBlock[]
  ctaLabel: string
  href?: string
  external?: boolean
}

export type OtherWaysSectionProps = {
  sectionHeading: string
  cards: OtherWaysCardProps[]
}

function toPortableTextBlocks(value: unknown): PortableTextBlock[] {
  return Array.isArray(value) ? (value as PortableTextBlock[]) : []
}

export function mapGetInvolvedIntroToProps(
  data: GetInvolvedIntroFields | null | undefined,
  pageTitle: string,
): GetInvolvedIntroProps | null {
  const title = pageTitle.trim()
  const heading = data?.heading?.trim()
  const callout = Array.isArray(data?.callout) ? data.callout : []
  const body = Array.isArray(data?.body) ? data.body : []
  const image = mapSanityImage(data?.image ?? null, '')

  if (!title || !heading || callout.length === 0 || body.length === 0 || !image) {
    return null
  }

  return {title, heading, callout, image, body}
}

function mapCard(card: OtherWaysCardFields, index: number): OtherWaysCardProps | null {
  const title = card.title?.trim()
  const body = toPortableTextBlocks(card.body)
  const ctaLabel = card.ctaLabel?.trim()
  const icon = mapSanityImage(card.icon ?? null, '')

  if (!title || body.length === 0 || !ctaLabel || !icon) {
    return null
  }

  const resolved = resolveContentLink(card.ctaLink)

  return {
    keyId: card._key?.trim() || `other-ways-${index}`,
    icon,
    title,
    body,
    ctaLabel,
    ...(resolved ? {href: resolved.href, external: resolved.external} : {}),
  }
}

export function mapOtherWaysSectionToProps(
  data: OtherWaysSectionFields | null | undefined,
): OtherWaysSectionProps | null {
  const sectionHeading = data?.sectionHeading?.trim()
  if (!sectionHeading) {
    return null
  }

  const cards = (Array.isArray(data?.cards) ? data.cards : [])
    .map((card, index) => mapCard(card, index))
    .filter((card): card is OtherWaysCardProps => card !== null)

  if (cards.length === 0) {
    return null
  }

  return {sectionHeading, cards}
}

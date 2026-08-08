import type {PortableTextBlock} from '@portabletext/react'

import type {HeroImage} from '@/components/hero/hero-image'
import {type BrandSvgPath, isBrandSvgPath} from '@/lib/brand-svgs'
import {type ContentLinkGroq, resolveContentLink} from '@/lib/content-link'
import {mapSanityImage, type SanityImageData} from '@/lib/mappers/sanity-image'

function toPortableTextBlocks(value: unknown): PortableTextBlock[] {
  return Array.isArray(value) ? (value as PortableTextBlock[]) : []
}

export type DataPreservationHeroProps = {
  /** Page title used as the accessible h1 when eyebrow is empty. */
  pageTitle: string
  eyebrow?: string
  heading: string
  body: PortableTextBlock[]
  ctaLabel?: string
  href?: string
  external?: boolean
  fileListImage?: HeroImage
  collageImage?: HeroImage
}

export type DataPreservationHeroFields = {
  eyebrow?: string | null
  heading?: string | null
  body?: unknown
  ctaLabel?: string | null
  ctaLink?: ContentLinkGroq | null
  fileListImage?: SanityImageData
  collageImage?: SanityImageData
}

export function mapDataPreservationHeroToProps(
  data: DataPreservationHeroFields | null | undefined,
  pageTitle: string,
): DataPreservationHeroProps | null {
  const heading = data?.heading?.trim()
  const body = toPortableTextBlocks(data?.body)
  const title = pageTitle.trim()
  if (!heading || body.length === 0 || !title) {
    return null
  }

  const eyebrow = data?.eyebrow?.trim() || undefined
  const ctaLabel = data?.ctaLabel?.trim() || undefined
  const resolved = resolveContentLink(data?.ctaLink)
  const fileListImage = mapSanityImage(data?.fileListImage ?? null, '')
  const collageImage = mapSanityImage(data?.collageImage ?? null, '')

  return {
    pageTitle: title,
    eyebrow,
    heading,
    body,
    ctaLabel,
    fileListImage,
    collageImage,
    ...(resolved && ctaLabel ? {href: resolved.href, external: resolved.external} : {}),
  }
}

export type FocusOnAccessItemProps = {
  keyId: string
  /** Public path from Studio `brandSvg` (e.g. `/brand/data-preservation/legislation.svg`). */
  iconSrc: BrandSvgPath
  heading: string
  body: PortableTextBlock[]
}

export type FocusOnAccessSectionProps = {
  sectionHeading: string
  items: FocusOnAccessItemProps[]
}

export type FocusOnAccessItemFields = {
  _key?: string | null
  icon?: string | null
  heading?: string | null
  body?: unknown
}

export type FocusOnAccessSectionFields = {
  sectionHeading?: string | null
  items?: FocusOnAccessItemFields[] | null
}

function mapFocusItem(item: FocusOnAccessItemFields, index: number): FocusOnAccessItemProps | null {
  const heading = item.heading?.trim()
  const icon = typeof item.icon === 'string' ? item.icon.trim() : ''
  const body = toPortableTextBlocks(item.body)
  if (!heading || !isBrandSvgPath(icon) || body.length === 0) {
    return null
  }

  return {
    keyId: item._key?.trim() || `focus-on-access-${index}`,
    iconSrc: icon,
    heading,
    body,
  }
}

export function mapFocusOnAccessSectionToProps(
  data: FocusOnAccessSectionFields | null | undefined,
): FocusOnAccessSectionProps | null {
  const sectionHeading = data?.sectionHeading?.trim()
  if (!sectionHeading) {
    return null
  }

  const rawItems = Array.isArray(data?.items) ? data.items : []
  const items = rawItems
    .map((item, index) => mapFocusItem(item, index))
    .filter((item): item is FocusOnAccessItemProps => item !== null)

  if (items.length === 0) {
    return null
  }

  return {sectionHeading, items}
}

export type RiskNominateSectionProps = {
  sectionHeading: string
  body: PortableTextBlock[]
  cardHeading: string
  cardBody: PortableTextBlock[]
  ctaLabel: string
  href?: string
  external?: boolean
}

export type RiskNominateSectionFields = {
  sectionHeading?: string | null
  body?: unknown
  cardHeading?: string | null
  cardBody?: unknown
  ctaLabel?: string | null
  ctaLink?: ContentLinkGroq | null
}

export function mapRiskNominateSectionToProps(
  data: RiskNominateSectionFields | null | undefined,
): RiskNominateSectionProps | null {
  const sectionHeading = data?.sectionHeading?.trim()
  const body = toPortableTextBlocks(data?.body)
  const cardHeading = data?.cardHeading?.trim()
  const cardBody = toPortableTextBlocks(data?.cardBody)
  const ctaLabel = data?.ctaLabel?.trim() || 'Nomination Form'
  if (!sectionHeading || body.length === 0 || !cardHeading || cardBody.length === 0) {
    return null
  }

  const resolved = resolveContentLink(data?.ctaLink)

  return {
    sectionHeading,
    body,
    cardHeading,
    cardBody,
    ctaLabel,
    ...(resolved ? {href: resolved.href, external: resolved.external} : {}),
  }
}

export type MetadataStandardsSectionProps = {
  sectionHeading: string
  body: PortableTextBlock[]
  image: HeroImage
  ctaLabel?: string
  href?: string
  external?: boolean
}

export type MetadataStandardsSectionFields = {
  sectionHeading?: string | null
  body?: unknown
  image?: SanityImageData
  ctaLabel?: string | null
  ctaLink?: ContentLinkGroq | null
}

export const METADATA_STANDARDS_IMAGE_SIZES =
  '(max-width: 1023px) calc(100vw - 32px), (max-width: 1399px) 45vw, 688px'

export function mapMetadataStandardsSectionToProps(
  data: MetadataStandardsSectionFields | null | undefined,
): MetadataStandardsSectionProps | null {
  const sectionHeading = data?.sectionHeading?.trim()
  const body = toPortableTextBlocks(data?.body)
  const image = mapSanityImage(data?.image ?? null, '')
  if (!sectionHeading || body.length === 0 || !image) {
    return null
  }

  const ctaLabel = data?.ctaLabel?.trim() || undefined
  const resolved = resolveContentLink(data?.ctaLink)

  return {
    sectionHeading,
    body,
    image,
    ctaLabel,
    ...(resolved && ctaLabel ? {href: resolved.href, external: resolved.external} : {}),
  }
}

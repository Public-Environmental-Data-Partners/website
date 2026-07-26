import type {PortableTextBlock} from '@portabletext/react'

import {type ContentLinkGroq, resolveContentLink} from '@/lib/content-link'

/** Fixed quote mark icon for the Testimonial band. */
export const TESTIMONIAL_QUOTE_ICON_SRC = '/brand/testimonial/quote.svg'

/** Dark blue band with light text, or light blue band with dark text. */
export type TestimonialSurface = 'dark' | 'light'

/** Quote mark art per band color — the icon is a flat fill, so each surface has its own asset. */
export const TESTIMONIAL_QUOTE_ICON_SRC_BY_SURFACE: Record<TestimonialSurface, string> = {
  dark: TESTIMONIAL_QUOTE_ICON_SRC,
  light: '/brand/testimonial/quote-dark-blue.svg',
}

export type TestimonialSectionProps = {
  sectionHeading: string
  quote: PortableTextBlock[]
  attribution?: string
  ctaLabel: string
  surface: TestimonialSurface
  /** Omit when no destination. */
  href?: string
  external?: boolean
}

export type TestimonialSectionFields = {
  sectionHeading?: string | null
  quote?: unknown
  attribution?: string | null
  ctaLabel?: string | null
  ctaLink?: ContentLinkGroq | null
  surface?: string | null
}

function toPortableTextBlocks(value: unknown): PortableTextBlock[] {
  return Array.isArray(value) ? (value as PortableTextBlock[]) : []
}

export function mapTestimonialSectionToProps(
  data: TestimonialSectionFields | null | undefined,
): TestimonialSectionProps | null {
  const sectionHeading = data?.sectionHeading?.trim()
  const quote = toPortableTextBlocks(data?.quote)
  if (!sectionHeading || quote.length === 0) {
    return null
  }

  const attribution = data?.attribution?.trim() || undefined
  const ctaLabel = data?.ctaLabel?.trim() || 'Get Involved'
  const surface: TestimonialSurface = data?.surface === 'light' ? 'light' : 'dark'
  const resolved = resolveContentLink(data?.ctaLink)

  return {
    sectionHeading,
    quote,
    attribution,
    ctaLabel,
    surface,
    ...(resolved ? {href: resolved.href, external: resolved.external} : {}),
  }
}

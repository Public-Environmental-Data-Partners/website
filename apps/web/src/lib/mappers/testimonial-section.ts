import type {PortableTextBlock} from '@portabletext/react'

import {type ContentLinkGroq, resolveContentLink} from '@/lib/content-link'

/** Fixed quote mark icon for the Testimonial band. */
export const TESTIMONIAL_QUOTE_ICON_SRC = '/brand/testimonial/quote.svg'

export type TestimonialSectionProps = {
  sectionHeading: string
  quote: PortableTextBlock[]
  attribution?: string
  ctaLabel: string
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
  const resolved = resolveContentLink(data?.ctaLink)

  return {
    sectionHeading,
    quote,
    attribution,
    ctaLabel,
    ...(resolved ? {href: resolved.href, external: resolved.external} : {}),
  }
}

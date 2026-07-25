import type {PortableTextBlock} from '@portabletext/react'

import {type ContentLinkGroq, resolveContentLink} from '@/lib/content-link'

/** Fixed quote mark icon for the Testimonial band. */
export const TESTIMONIAL_QUOTE_ICON_SRC = '/brand/testimonial/quote.svg'

export type TestimonialSectionProps = {
  kicker: string
  quote: PortableTextBlock[]
  attribution?: string
  ctaLabel: string
  /** Omit when no destination. */
  href?: string
  external?: boolean
}

export type TestimonialSectionFields = {
  kicker?: string | null
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
  const kicker = data?.kicker?.trim()
  const quote = toPortableTextBlocks(data?.quote)
  if (!kicker || quote.length === 0) {
    return null
  }

  const attribution = data?.attribution?.trim() || undefined
  const ctaLabel = data?.ctaLabel?.trim() || 'Get Involved'
  const resolved = resolveContentLink(data?.ctaLink)

  return {
    kicker,
    quote,
    attribution,
    ctaLabel,
    ...(resolved ? {href: resolved.href, external: resolved.external} : {}),
  }
}

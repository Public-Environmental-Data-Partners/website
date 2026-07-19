import type {PortableTextBlock} from '@portabletext/react'

/** Fixed quote mark icon for the Testimonial band. */
export const TESTIMONIAL_QUOTE_ICON_SRC = '/brand/testimonial/quote.svg'

export type TestimonialSectionProps = {
  kicker: string
  quote: PortableTextBlock[]
  attribution?: string
  ctaLabel: string
  /** Root-relative href; omit when no site page selected. */
  href?: string
}

export type TestimonialSectionFields = {
  kicker?: string | null
  quote?: unknown
  attribution?: string | null
  ctaLabel?: string | null
  ctaPage?: {slug?: {current?: string | null} | null} | null
}

function toPortableTextBlocks(value: unknown): PortableTextBlock[] {
  return Array.isArray(value) ? (value as PortableTextBlock[]) : []
}

function normalizeInternalPath(path: string): string {
  const p = path.trim()
  if (!p) {
    return ''
  }
  return p.startsWith('/') ? p : `/${p}`
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
  const slug = data?.ctaPage?.slug?.current?.trim()
  const href = slug ? normalizeInternalPath(slug) : undefined

  return {
    kicker,
    quote,
    attribution,
    ctaLabel,
    href,
  }
}

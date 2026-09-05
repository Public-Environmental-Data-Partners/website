import type {PortableTextBlock} from '@portabletext/react'

export const SIMPLE_SECTION_BACKGROUNDS = ['cream', 'offWhite', 'lightBeige'] as const

export type SimpleSectionBackground = (typeof SIMPLE_SECTION_BACKGROUNDS)[number]

export const SIMPLE_SECTION_BACKGROUND_CLASS: Record<SimpleSectionBackground, string> = {
  cream: 'bg-cream',
  offWhite: 'bg-off-white',
  lightBeige: 'bg-light-beige',
}

export type SimpleSectionProps = {
  sectionHeading: string
  body: PortableTextBlock[]
  background: SimpleSectionBackground
  /** Unique heading id when multiple simple sections appear on one page. */
  headingId?: string
}

export type SimpleSectionFields = {
  sectionHeading?: string | null
  body?: unknown
  background?: string | null
}

function toPortableTextBlocks(value: unknown): PortableTextBlock[] {
  return Array.isArray(value) ? (value as PortableTextBlock[]) : []
}

function isSimpleSectionBackground(value: string): value is SimpleSectionBackground {
  return (SIMPLE_SECTION_BACKGROUNDS as readonly string[]).includes(value)
}

export function mapSimpleSectionToProps(
  data: SimpleSectionFields | null | undefined,
): Omit<SimpleSectionProps, 'headingId'> | null {
  const sectionHeading = data?.sectionHeading?.trim()
  const body = toPortableTextBlocks(data?.body)
  if (!sectionHeading || body.length === 0) {
    return null
  }

  const background: SimpleSectionBackground =
    typeof data?.background === 'string' && isSimpleSectionBackground(data.background)
      ? data.background
      : 'cream'

  return {sectionHeading, body, background}
}

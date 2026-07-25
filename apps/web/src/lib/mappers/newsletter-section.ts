import {pickNewsletterPrompt, pickSectionHeadingFromKicker} from '@/lib/mappers/content-field-compat'

export type NewsletterSectionProps = {
  presentation: 'homepage' | 'contact'
  sectionHeading: string
  prompt: string
  emailPlaceholder: string
  submitLabel: string
}

export type NewsletterSectionFields = {
  presentation?: 'homepage' | 'contact' | null
  /** Target field after terminology migration. */
  sectionHeading?: string | null
  /** Legacy section label. */
  kicker?: string | null
  /** Target newsletter ask line after terminology migration. */
  prompt?: string | null
  /** Legacy newsletter ask line (Studio title: Prompt). */
  heading?: string | null
  emailPlaceholder?: string | null
  submitLabel?: string | null
}

export function mapNewsletterSectionToProps(
  data: NewsletterSectionFields | null | undefined,
): NewsletterSectionProps | null {
  const sectionHeading = pickSectionHeadingFromKicker(data ?? {}) || 'STAY IN TOUCH'
  const prompt = pickNewsletterPrompt(data ?? {})
  const emailPlaceholder = data?.emailPlaceholder?.trim() || 'YourEmail@example.com'
  const submitLabel = data?.submitLabel?.trim() || 'Subscribe'
  if (!prompt) {
    return null
  }
  return {
    presentation: data?.presentation === 'contact' ? 'contact' : 'homepage',
    sectionHeading,
    prompt,
    emailPlaceholder,
    submitLabel,
  }
}

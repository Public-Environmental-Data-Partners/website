export type NewsletterSectionProps = {
  presentation: 'homepage' | 'contact'
  sectionHeading: string
  prompt: string
  emailPlaceholder: string
  submitLabel: string
}

export type NewsletterSectionFields = {
  presentation?: 'homepage' | 'contact' | null
  sectionHeading?: string | null
  prompt?: string | null
  emailPlaceholder?: string | null
  submitLabel?: string | null
}

export function mapNewsletterSectionToProps(
  data: NewsletterSectionFields | null | undefined,
): NewsletterSectionProps | null {
  const sectionHeading = data?.sectionHeading?.trim() || 'STAY IN TOUCH'
  const prompt = data?.prompt?.trim()
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

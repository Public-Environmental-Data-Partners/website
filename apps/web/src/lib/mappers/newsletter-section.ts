export type NewsletterSectionProps = {
  kicker: string
  heading: string
  emailPlaceholder: string
  submitLabel: string
}

export type NewsletterSectionFields = {
  kicker?: string | null
  heading?: string | null
  emailPlaceholder?: string | null
  submitLabel?: string | null
}

export function mapNewsletterSectionToProps(
  data: NewsletterSectionFields | null | undefined,
): NewsletterSectionProps | null {
  const kicker = data?.kicker?.trim() || 'STAY IN TOUCH'
  const heading = data?.heading?.trim()
  const emailPlaceholder = data?.emailPlaceholder?.trim() || 'YourEmail@example.com'
  const submitLabel = data?.submitLabel?.trim() || 'Subscribe'
  if (!heading) {
    return null
  }
  return {
    kicker,
    heading,
    emailPlaceholder,
    submitLabel,
  }
}

export type NewsletterSectionProps = {
  heading: string
  body?: string
  emailPlaceholder: string
  submitLabel: string
}

export type NewsletterSectionFields = {
  heading?: string | null
  body?: string | null
  emailPlaceholder?: string | null
  submitLabel?: string | null
}

export function mapNewsletterSectionToProps(
  data: NewsletterSectionFields | null | undefined,
): NewsletterSectionProps | null {
  const heading = data?.heading?.trim()
  const emailPlaceholder = data?.emailPlaceholder?.trim()
  const submitLabel = data?.submitLabel?.trim()
  if (!heading || !emailPlaceholder || !submitLabel) {
    return null
  }
  const body = data?.body?.trim()
  return {
    heading,
    emailPlaceholder,
    submitLabel,
    ...(body ? {body} : {}),
  }
}

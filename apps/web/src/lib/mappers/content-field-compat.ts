/**
 * Dual-read helpers for the content-terminology rollout.
 * Prefer the target field; fall back to a scoped legacy field for that section type.
 * @see docs/content-terminology.md
 */

export function firstNonEmpty(
  ...values: Array<string | null | undefined>
): string | undefined {
  for (const value of values) {
    const trimmed = value?.trim()
    if (trimmed) {
      return trimmed
    }
  }
  return undefined
}

/** Target `sectionHeading`, then legacy `kicker` (By the Numbers, highlight, newsletter, testimonial). */
export function pickSectionHeadingFromKicker(data: {
  sectionHeading?: string | null
  kicker?: string | null
}): string | undefined {
  return firstNonEmpty(data.sectionHeading, data.kicker)
}

/** Target `sectionHeading`, then legacy `heading` (What We Do, partner logos). */
export function pickSectionHeadingFromHeading(data: {
  sectionHeading?: string | null
  heading?: string | null
}): string | undefined {
  return firstNonEmpty(data.sectionHeading, data.heading)
}

/**
 * Target `sectionHeading`, then Contact legacy `kicker` or earlier `heading`.
 * Contact may still be mid-rename depending on dataset.
 */
export function pickContactSectionHeading(data: {
  sectionHeading?: string | null
  kicker?: string | null
  heading?: string | null
}): string | undefined {
  return firstNonEmpty(data.sectionHeading, data.kicker, data.heading)
}

/** Target `prompt`, then newsletter legacy `heading`. */
export function pickNewsletterPrompt(data: {
  prompt?: string | null
  heading?: string | null
}): string | undefined {
  return firstNonEmpty(data.prompt, data.heading)
}

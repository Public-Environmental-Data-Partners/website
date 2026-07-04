/** Display label for optional photo credit fields (hero + article figures). */
export function formatPhotoCredit(credit: string | null | undefined): string | undefined {
  const name = credit?.trim()
  if (!name) {
    return undefined
  }
  if (/^photo credit:/i.test(name)) {
    return name
  }
  return `PHOTO CREDIT: ${name}`
}

import type {PortableTextBlock} from '@portabletext/react'

/** Normalize PT caption or legacy plain-text caption from older documents. */
export function normalizeFigureCaption(
  caption: PortableTextBlock[] | string | null | undefined,
): PortableTextBlock[] {
  if (Array.isArray(caption) && caption.length > 0) {
    return caption as PortableTextBlock[]
  }

  if (typeof caption === 'string') {
    const text = caption.trim()
    if (!text) {
      return []
    }
    return [
      {
        _type: 'block',
        _key: 'legacy-caption',
        style: 'normal',
        markDefs: [],
        children: [
          {
            _type: 'span',
            _key: 'legacy-caption-span',
            text,
            marks: [],
          },
        ],
      },
    ]
  }

  return []
}

export function resolvePhotoCredit(credit: string | null | undefined): string | undefined {
  const trimmed = credit?.trim()
  return trimmed || undefined
}

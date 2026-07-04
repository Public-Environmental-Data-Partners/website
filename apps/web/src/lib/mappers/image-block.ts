import type {PortableTextBlock} from '@portabletext/react'

import type {ImageBlockEntry} from '@/components/content/article-body-block'

/** Prefer `photoCredit`; fall back to legacy `source` until CMS entries are migrated. */
export function resolveImageBlockPhotoCredit(block: ImageBlockEntry): string | undefined {
  const credit = block.photoCredit?.trim() || block.source?.trim()
  return credit || undefined
}

/** Normalize PT caption or legacy plain-text caption from older documents. */
export function normalizeImageBlockCaption(
  caption: ImageBlockEntry['caption'],
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

import type {PortableTextBlock} from '@portabletext/react'

import {RichTextBlock} from '@/components/content/rich-text-block'

/** Typed body entries — extend in Phases 4–5 (quote, image, youtube, audio). */
export type RichTextBlockEntry = {
  _type: 'richTextBlock'
  _key?: string
  content?: PortableTextBlock[] | null
}

export type ArticleBodyBlockEntry = PortableTextBlock | RichTextBlockEntry

export function isPortableTextBlockEntry(block: ArticleBodyBlockEntry): block is PortableTextBlock {
  return block._type === 'block'
}

export function isRichTextBlockEntry(block: ArticleBodyBlockEntry): block is RichTextBlockEntry {
  return block._type === 'richTextBlock'
}

type ArticleBodyBlockProps = {
  block: ArticleBodyBlockEntry
}

export function ArticleBodyBlock({block}: ArticleBodyBlockProps) {
  if (isPortableTextBlockEntry(block)) {
    return <RichTextBlock value={[block]} />
  }

  if (isRichTextBlockEntry(block)) {
    const content = Array.isArray(block.content) ? block.content : []
    return <RichTextBlock value={content} />
  }

  return null
}

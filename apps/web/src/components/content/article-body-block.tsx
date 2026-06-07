import type {PortableTextBlock} from '@portabletext/react'

import {QuoteBlock} from '@/components/content/quote-block'
import {RichTextBlock} from '@/components/content/rich-text-block'

/** Typed body entries — extend in Phases 4–5 (image, youtube, audio). */
export type RichTextBlockEntry = {
  _type: 'richTextBlock'
  _key?: string
  content?: PortableTextBlock[] | null
}

export type QuoteBlockEntry = {
  _type: 'quoteBlock'
  _key?: string
  quote?: string | null
  attribution?: string | null
}

export type ArticleBodyBlockEntry = PortableTextBlock | RichTextBlockEntry | QuoteBlockEntry

export function isPortableTextBlockEntry(block: ArticleBodyBlockEntry): block is PortableTextBlock {
  return block._type === 'block'
}

export function isRichTextBlockEntry(block: ArticleBodyBlockEntry): block is RichTextBlockEntry {
  return block._type === 'richTextBlock'
}

export function isQuoteBlockEntry(block: ArticleBodyBlockEntry): block is QuoteBlockEntry {
  return block._type === 'quoteBlock'
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

  if (isQuoteBlockEntry(block)) {
    const quote = typeof block.quote === 'string' ? block.quote : ''
    if (!quote.trim()) {
      return null
    }
    return <QuoteBlock attribution={block.attribution} quote={quote} />
  }

  return null
}

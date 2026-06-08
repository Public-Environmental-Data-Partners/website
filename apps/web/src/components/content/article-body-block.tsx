import type {PortableTextBlock} from '@portabletext/react'

import {EmbedBlock} from '@/components/content/embed-block'
import {ImageBlock} from '@/components/content/image-block'
import {QuoteBlock} from '@/components/content/quote-block'
import {RichTextBlock} from '@/components/content/rich-text-block'
import {resolveEmbedUrl} from '@/lib/embed-providers'
import {mapSanityImage, type SanityImageData} from '@/lib/mappers/sanity-image'

/** Typed body entries — extend in Phase 5 (audio). */
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

export type ImageBlockEntry = {
  _type: 'imageBlock'
  _key?: string
  image?: SanityImageData
  caption?: string | null
  source?: string | null
}

export type EmbedBlockEntry = {
  _type: 'embedBlock'
  _key?: string
  url?: string | null
  caption?: string | null
}

export type ArticleBodyBlockEntry =
  | PortableTextBlock
  | RichTextBlockEntry
  | QuoteBlockEntry
  | ImageBlockEntry
  | EmbedBlockEntry

export function isPortableTextBlockEntry(block: ArticleBodyBlockEntry): block is PortableTextBlock {
  return block._type === 'block'
}

export function isRichTextBlockEntry(block: ArticleBodyBlockEntry): block is RichTextBlockEntry {
  return block._type === 'richTextBlock'
}

export function isQuoteBlockEntry(block: ArticleBodyBlockEntry): block is QuoteBlockEntry {
  return block._type === 'quoteBlock'
}

export function isImageBlockEntry(block: ArticleBodyBlockEntry): block is ImageBlockEntry {
  return block._type === 'imageBlock'
}

export function isEmbedBlockEntry(block: ArticleBodyBlockEntry): block is EmbedBlockEntry {
  return block._type === 'embedBlock'
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

  if (isImageBlockEntry(block)) {
    const mapped = mapSanityImage(block.image ?? null, '')
    if (!mapped) {
      return null
    }
    return <ImageBlock caption={block.caption} image={mapped} source={block.source} />
  }

  if (isEmbedBlockEntry(block)) {
    const url = typeof block.url === 'string' ? block.url : ''
    const embed = resolveEmbedUrl(url)
    if (!embed) {
      return null
    }
    return <EmbedBlock caption={block.caption} embed={embed} />
  }

  return null
}

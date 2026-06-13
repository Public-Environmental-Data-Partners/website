import type {PortableTextBlock} from '@portabletext/react'

import {EmbedBlock} from '@/components/content/embed-block'
import {ImageBlock} from '@/components/content/image-block'
import {
  ListBlock,
  type ListBlockBackground,
  type ListBlockBulletedSection,
  type ListBlockRow,
  type ListBlockVariant,
} from '@/components/content/list-block'
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

export type ListBlockEntry = {
  _type: 'listBlock'
  _key?: string
  variant?: string | null
  background?: string | null
  title?: string | null
  lines?: string[] | null
  rows?: ListBlockRow[] | null
  sections?: ListBlockBulletedSection[] | null
}

export type ArticleBodyBlockEntry =
  | PortableTextBlock
  | RichTextBlockEntry
  | QuoteBlockEntry
  | ImageBlockEntry
  | EmbedBlockEntry
  | ListBlockEntry

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

export function isListBlockEntry(block: ArticleBodyBlockEntry): block is ListBlockEntry {
  return block._type === 'listBlock'
}

const LIST_BLOCK_VARIANTS = new Set<ListBlockVariant>([
  'unstyled',
  'dividedParagraph',
  'dividedIcon',
  'dividedOrdered',
  'dividedBulleted',
])

const LIST_BLOCK_BACKGROUNDS = new Set<ListBlockBackground>(['lightGreen', 'lightBlue'])

function parseListBlockVariant(value: unknown): ListBlockVariant | null {
  return typeof value === 'string' && LIST_BLOCK_VARIANTS.has(value as ListBlockVariant)
    ? (value as ListBlockVariant)
    : null
}

function parseListBlockBackground(value: unknown): ListBlockBackground {
  return typeof value === 'string' &&
    LIST_BLOCK_BACKGROUNDS.has(value as ListBlockBackground)
    ? (value as ListBlockBackground)
    : 'lightGreen'
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

  if (isListBlockEntry(block)) {
    const variant = parseListBlockVariant(block.variant)
    if (!variant) {
      return null
    }
    return (
      <ListBlock
        background={parseListBlockBackground(block.background)}
        lines={block.lines}
        rows={block.rows}
        sections={block.sections}
        title={block.title}
        variant={variant}
      />
    )
  }

  return null
}

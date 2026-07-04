import type {PortableTextBlock} from '@portabletext/react'
import type {ReactNode} from 'react'

import {
  ArticleBodyBlock,
  type ArticleBodyBlockEntry,
  isPortableTextBlockEntry,
} from '@/components/content/article-body-block'
import {RichTextBlock} from '@/components/content/rich-text-block'
import {Grid12, SectionBand, SiteShell} from '@/components/layout'
import {ARTICLE_BODY_BLOCK_CLASS} from '@/lib/article-body-grid'
import {cn} from '@/lib/utils'

type ArticleBodyProps = {
  body: unknown
}

function toBodyEntries(value: unknown): ArticleBodyBlockEntry[] {
  if (!Array.isArray(value)) {
    return []
  }
  return value as ArticleBodyBlockEntry[]
}

function isPortableTextBody(blocks: ArticleBodyBlockEntry[]): blocks is PortableTextBlock[] {
  return blocks.length > 0 && blocks.every((block) => isPortableTextBlockEntry(block))
}

function ArticleBodyBlockRow({children, className}: {children: ReactNode; className?: string}) {
  return (
    <div
      data-slot="article-body-block"
      className={cn(ARTICLE_BODY_BLOCK_CLASS, 'text-left', className)}
    >
      {children}
    </div>
  )
}

function ArticleBodyShell({children}: {children: ReactNode}) {
  return (
    <SectionBand className="overflow-x-clip bg-white">
      <SiteShell>
        <Grid12 data-slot="article-body-grid">{children}</Grid12>
      </SiteShell>
    </SectionBand>
  )
}

export function ArticleBody({body}: ArticleBodyProps) {
  const blocks = toBodyEntries(body)
  if (blocks.length === 0) {
    return null
  }

  if (isPortableTextBody(blocks)) {
    return (
      <ArticleBodyShell>
        <ArticleBodyBlockRow>
          <RichTextBlock value={blocks} />
        </ArticleBodyBlockRow>
      </ArticleBodyShell>
    )
  }

  return (
    <ArticleBodyShell>
      {blocks.map((block, index) => (
        <ArticleBodyBlockRow key={block._key ?? `body-block-${index}`}>
          <ArticleBodyBlock block={block} />
        </ArticleBodyBlockRow>
      ))}
    </ArticleBodyShell>
  )
}

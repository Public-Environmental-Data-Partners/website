import type {PortableTextBlock} from '@portabletext/react'
import type {ReactNode} from 'react'

import {
  ArticleBodyBlock,
  type ArticleBodyBlockEntry,
  isPortableTextBlockEntry,
} from '@/components/content/article-body-block'
import {RichTextBlock} from '@/components/content/rich-text-block'
import {SectionBand, SiteShell} from '@/components/layout'

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

function ArticleBodyShell({children}: {children: ReactNode}) {
  return (
    <SectionBand className="overflow-x-clip bg-white">
      <SiteShell>
        <div
          className="mx-auto w-full max-w-article-prose text-left"
          data-slot="article-body-prose"
        >
          {children}
        </div>
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
        <RichTextBlock value={blocks} />
      </ArticleBodyShell>
    )
  }

  return (
    <ArticleBodyShell>
      {blocks.map((block, index) => (
        <ArticleBodyBlock key={block._key ?? `body-block-${index}`} block={block} />
      ))}
    </ArticleBodyShell>
  )
}

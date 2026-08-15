import type {PortableTextBlock} from '@portabletext/react'
import type {ReactNode} from 'react'

import {
  ArticleBodyBlock,
  type ArticleBodyBlockEntry,
  isEmbedBlockEntry,
  isPortableTextBlockEntry,
  isRichTextBlockEntry,
} from '@/components/content/article-body-block'
import {RichTextBlock} from '@/components/content/rich-text-block'
import {Grid12, SectionBand, SiteShell} from '@/components/layout'
import {
  type ArticleBodyBlockColumnKind,
  getArticleBodyBlockColumnClass,
} from '@/lib/article-body-grid'
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

type ArticleBodyRow =
  | {kind: 'prose'; key: string; blocks: PortableTextBlock[]}
  | {kind: 'other'; key: string; block: ArticleBodyBlockEntry}

/** Consecutive Portable Text blocks share one renderer so lists stay a single <ul>/<ol>. */
function groupBodyEntries(blocks: ArticleBodyBlockEntry[]): ArticleBodyRow[] {
  const rows: ArticleBodyRow[] = []

  for (const [index, block] of blocks.entries()) {
    if (isPortableTextBlockEntry(block)) {
      const last = rows.at(-1)
      if (last?.kind === 'prose') {
        last.blocks.push(block)
        continue
      }
      rows.push({
        kind: 'prose',
        key: block._key ?? `prose-${index}`,
        blocks: [block],
      })
      continue
    }

    rows.push({
      kind: 'other',
      key: block._key ?? `body-block-${index}`,
      block,
    })
  }

  return rows
}

function getBodyBlockColumnKind(block: ArticleBodyBlockEntry): ArticleBodyBlockColumnKind {
  if (isPortableTextBlockEntry(block) || isRichTextBlockEntry(block)) {
    return 'prose'
  }
  if (isEmbedBlockEntry(block)) {
    return 'embed'
  }
  return 'default'
}

function ArticleBodyBlockRow({
  children,
  columnKind = 'default',
}: {
  children: ReactNode
  columnKind?: ArticleBodyBlockColumnKind
}) {
  const isProse = columnKind === 'prose'

  return (
    <div
      data-slot={isProse ? 'article-body-prose' : 'article-body-block'}
      className={cn(getArticleBodyBlockColumnClass(columnKind), 'min-w-0 text-left')}
    >
      {children}
    </div>
  )
}

function ArticleBodyShell({children}: {children: ReactNode}) {
  return (
    <SectionBand className="overflow-x-clip bg-cream">
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

  const rows = groupBodyEntries(blocks)

  return (
    <ArticleBodyShell>
      {rows.map((row) =>
        row.kind === 'prose' ? (
          <ArticleBodyBlockRow columnKind="prose" key={row.key}>
            <RichTextBlock value={row.blocks} />
          </ArticleBodyBlockRow>
        ) : (
          <ArticleBodyBlockRow
            columnKind={getBodyBlockColumnKind(row.block)}
            key={row.key}
          >
            <ArticleBodyBlock block={row.block} />
          </ArticleBodyBlockRow>
        ),
      )}
    </ArticleBodyShell>
  )
}

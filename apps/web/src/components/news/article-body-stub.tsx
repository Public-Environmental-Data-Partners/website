import {
  defaultComponents,
  mergeComponents,
  PortableText,
  type PortableTextBlock,
  type PortableTextComponents,
} from '@portabletext/react'

import {SectionBand, SiteShell} from '@/components/layout'

type ArticleBodyStubProps = {
  body: PortableTextBlock[] | null | undefined
}

const portableTextComponents: Partial<PortableTextComponents> = {
  block: {
    normal: ({children}: {children?: React.ReactNode}) => (
      <p className="text-muted-foreground mb-4 leading-relaxed last:mb-0">{children}</p>
    ),
    h2: ({children}: {children?: React.ReactNode}) => (
      <h2 className="text-foreground mb-4 mt-8 text-xl font-semibold tracking-tight first:mt-0 md:text-2xl">
        {children}
      </h2>
    ),
    h3: ({children}: {children?: React.ReactNode}) => (
      <h3 className="text-foreground mb-3 mt-6 text-lg font-semibold first:mt-0 md:text-xl">
        {children}
      </h3>
    ),
  },
  marks: {
    strong: ({children}: {children?: React.ReactNode}) => (
      <strong className="text-foreground font-semibold">{children}</strong>
    ),
    link: ({children, value}: {children?: React.ReactNode; value?: {href?: string}}) => (
      <a href={value?.href ?? '#'} className="text-accent underline underline-offset-2">
        {children}
      </a>
    ),
  },
}

const richTextComponents = mergeComponents(defaultComponents, portableTextComponents)

function toPortableTextBlocks(value: unknown): PortableTextBlock[] {
  return Array.isArray(value) ? (value as PortableTextBlock[]) : []
}

/** Minimal article body renderer — expanded in Phase 3 (ArticleBody dispatcher). */
export function ArticleBodyStub({body}: ArticleBodyStubProps) {
  const blocks = toPortableTextBlocks(body)
  if (blocks.length === 0) {
    return null
  }

  return (
    <SectionBand className="bg-white">
      <SiteShell>
        <div className="mx-auto w-full max-w-prose text-left">
          <PortableText components={richTextComponents} value={blocks} />
        </div>
      </SiteShell>
    </SectionBand>
  )
}

import {
  defaultComponents,
  mergeComponents,
  PortableText,
  type PortableTextBlock,
  type PortableTextComponents,
} from '@portabletext/react'

import {contentLinkMark} from '@/components/content/portable-text-link'

type SimpleSectionBlockProps = {
  heading?: string | null
  body: PortableTextBlock[] | null | undefined
}

const portableTextComponents: Partial<PortableTextComponents> = {
  block: {
    normal: ({children}: {children?: React.ReactNode}) => (
      <p className="text-muted-foreground mb-4 max-w-prose leading-relaxed last:mb-0">{children}</p>
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
  list: {
    // Match global `p` body size (1.375rem) — lists inherit `body` (0.875rem) otherwise.
    bullet: ({children}: {children?: React.ReactNode}) => (
      <ul className="text-muted-foreground mb-4 list-disc space-y-2 ps-6 text-[1.375rem] leading-[1.625] last:mb-0">
        {children}
      </ul>
    ),
    number: ({children}: {children?: React.ReactNode}) => (
      <ol className="text-muted-foreground mb-4 list-decimal space-y-2 ps-6 text-[1.375rem] leading-[1.625] last:mb-0">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({children}: {children?: React.ReactNode}) => <li>{children}</li>,
    number: ({children}: {children?: React.ReactNode}) => <li>{children}</li>,
  },
  marks: {
    strong: ({children}: {children?: React.ReactNode}) => (
      <strong className="text-foreground font-semibold">{children}</strong>
    ),
    link: contentLinkMark('text-accent underline underline-offset-2'),
  },
}

const richTextComponents = mergeComponents(defaultComponents, portableTextComponents)

export function SimpleSectionBlock({heading, body}: SimpleSectionBlockProps) {
  if (!body?.length) {
    return null
  }

  const trimmedHeading = heading?.trim()

  return (
    <section className="flex flex-col gap-4">
      {trimmedHeading ? (
        <h2 className="text-foreground text-3xl font-semibold tracking-tight md:text-4xl">
          {trimmedHeading}
        </h2>
      ) : null}
      <PortableText components={richTextComponents} value={body} />
    </section>
  )
}

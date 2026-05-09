import {
  defaultComponents,
  mergeComponents,
  PortableText,
  type PortableTextBlock,
  type PortableTextComponents,
} from '@portabletext/react'

type SimpleSectionBlockProps = {
  heading: string
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

export function SimpleSectionBlock({heading, body}: SimpleSectionBlockProps) {
  if (!body?.length) {
    return null
  }

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-foreground text-3xl font-semibold tracking-tight md:text-4xl">
        {heading}
      </h2>
      <PortableText components={richTextComponents} value={body} />
    </section>
  )
}

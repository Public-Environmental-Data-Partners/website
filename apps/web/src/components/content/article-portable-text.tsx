import {defaultComponents, mergeComponents, type PortableTextComponents} from '@portabletext/react'

/**
 * Article detail body typography.
 * Heading sizes/weight live in `article-body.css` under `[data-slot='article-body-prose']`.
 */
export const articlePortableTextComponents: Partial<PortableTextComponents> = {
  block: {
    normal: ({children}: {children?: React.ReactNode}) => (
      <p className="text-muted-foreground mb-4 leading-relaxed last:mb-0">{children}</p>
    ),
    h1: ({children}: {children?: React.ReactNode}) => <h1>{children}</h1>,
    h2: ({children}: {children?: React.ReactNode}) => <h2>{children}</h2>,
    h3: ({children}: {children?: React.ReactNode}) => <h3>{children}</h3>,
    h4: ({children}: {children?: React.ReactNode}) => <h4>{children}</h4>,
    h5: ({children}: {children?: React.ReactNode}) => <h5>{children}</h5>,
  },
  list: {
    bullet: ({children}: {children?: React.ReactNode}) => (
      <ul className="text-muted-foreground mb-4 list-disc space-y-2 ps-6 leading-relaxed last:mb-0">
        {children}
      </ul>
    ),
    number: ({children}: {children?: React.ReactNode}) => (
      <ol className="text-muted-foreground mb-4 list-decimal space-y-2 ps-6 leading-relaxed last:mb-0">
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
    link: ({children, value}: {children?: React.ReactNode; value?: {href?: string}}) => (
      <a href={value?.href ?? '#'} className="text-accent underline underline-offset-2">
        {children}
      </a>
    ),
  },
}

export const articleRichTextComponents = mergeComponents(
  defaultComponents,
  articlePortableTextComponents,
)

import {defaultComponents, mergeComponents, type PortableTextComponents} from '@portabletext/react'

/** Article detail body typography — keep in sync with detail page QA (Phase 3). */
export const articlePortableTextComponents: Partial<PortableTextComponents> = {
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

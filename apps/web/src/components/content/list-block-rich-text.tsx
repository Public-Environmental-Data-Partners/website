import {defaultComponents, mergeComponents, type PortableTextComponents} from '@portabletext/react'

/** Rich text inside list-block rows — Figtree 22px, inherited foreground, tight leading. */
export const listBlockRichTextComponents: Partial<PortableTextComponents> = {
  block: {
    normal: ({children}: {children?: React.ReactNode}) => (
      <p className="m-0 leading-none [&+p]:mt-3">{children}</p>
    ),
  },
  marks: {
    strong: ({children}: {children?: React.ReactNode}) => (
      <strong className="font-semibold">{children}</strong>
    ),
    link: ({children, value}: {children?: React.ReactNode; value?: {href?: string}}) => (
      <a href={value?.href ?? '#'} className="underline underline-offset-[0.15em]">
        {children}
      </a>
    ),
  },
}

export const listBlockPortableTextComponents = mergeComponents(
  defaultComponents,
  listBlockRichTextComponents,
)

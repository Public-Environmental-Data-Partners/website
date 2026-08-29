import {
  defaultComponents,
  mergeComponents,
  PortableText,
  type PortableTextBlock,
  type PortableTextComponents,
} from '@portabletext/react'

import {contentLinkMark} from '@/components/content/portable-text-link'

type LegalDocumentSectionProps = {
  body: PortableTextBlock[] | null | undefined
}

/**
 * Body for CMS `legalDocumentSection` (Privacy Policy, Terms, etc.).
 * Figtree 22 / weight 600 / off-black; lists match paragraph size.
 */
const portableTextComponents: Partial<PortableTextComponents> = {
  block: {
    normal: ({children}: {children?: React.ReactNode}) => (
      <p className="text-off-black mb-4 max-w-prose text-[1.375rem] font-semibold leading-[1.625] last:mb-0">
        {children}
      </p>
    ),
  },
  list: {
    bullet: ({children}: {children?: React.ReactNode}) => (
      <ul className="text-off-black mb-4 list-disc space-y-2 ps-6 text-[1.375rem] font-semibold leading-[1.625] last:mb-0">
        {children}
      </ul>
    ),
    number: ({children}: {children?: React.ReactNode}) => (
      <ol className="text-off-black mb-4 list-decimal space-y-2 ps-6 text-[1.375rem] font-semibold leading-[1.625] last:mb-0">
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
      <strong className="text-off-black font-semibold">{children}</strong>
    ),
    link: contentLinkMark('text-accent'),
  },
}

const richTextComponents = mergeComponents(defaultComponents, portableTextComponents)

export function LegalDocumentSection({body}: LegalDocumentSectionProps) {
  if (!body?.length) {
    return null
  }

  return (
    <div data-slot="legal-document-section">
      <PortableText components={richTextComponents} value={body} />
    </div>
  )
}

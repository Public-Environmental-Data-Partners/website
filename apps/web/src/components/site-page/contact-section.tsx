import {
  defaultComponents,
  mergeComponents,
  PortableText,
  type PortableTextBlock,
  type PortableTextComponents,
  type PortableTextTypeComponentProps,
} from '@portabletext/react'

import {contentLinkMark} from '@/components/content/portable-text-link'
import {ContentLink} from '@/components/content-link'
import {Grid12, SectionBand, SiteShell} from '@/components/layout'
import {Button} from '@/components/ui/button'
import {type ContentLinkGroq, resolveContentLink} from '@/lib/content-link'

export type ContactCtaBlock = {
  _type: 'contactCta'
  _key: string
  label?: string | null
  link?: ContentLinkGroq | null
}

type ContactSectionProps = {
  sectionHeading: string
  body: Array<PortableTextBlock | ContactCtaBlock>
}

function ContactCta({value}: PortableTextTypeComponentProps<ContactCtaBlock>) {
  const label = value.label?.trim()
  const resolved = resolveContentLink(value.link)
  if (!label || !resolved) {
    return null
  }

  return (
    <div className="my-8">
      <Button asChild variant="surface" size="cta">
        <ContentLink href={resolved.href} external={resolved.external}>
          {label}
        </ContentLink>
      </Button>
    </div>
  )
}

const portableTextComponents: Partial<PortableTextComponents> = {
  block: {
    normal: ({children}: {children?: React.ReactNode}) => (
      <p className="text-off-black mb-6 font-sans text-[1.375rem] leading-none font-semibold tracking-normal last:mb-0">
        {children}
      </p>
    ),
  },
  list: {
    bullet: ({children}: {children?: React.ReactNode}) => (
      <ul className="text-off-black mb-6 list-disc space-y-3 ps-6 font-sans text-[1.375rem] leading-none font-semibold last:mb-0">
        {children}
      </ul>
    ),
    number: ({children}: {children?: React.ReactNode}) => (
      <ol className="text-off-black mb-6 list-decimal space-y-3 ps-6 font-sans text-[1.375rem] leading-none font-semibold last:mb-0">
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
      <strong className="font-semibold">{children}</strong>
    ),
    link: contentLinkMark('text-off-black underline underline-offset-2'),
  },
  types: {
    contactCta: ContactCta,
  },
}

const richTextComponents = mergeComponents(defaultComponents, portableTextComponents)

/** Full 12-column contact card with inline, editor-placeable CTA blocks. */
export function ContactSection({sectionHeading, body}: ContactSectionProps) {
  if (!body.length) {
    return null
  }

  return (
    <SectionBand className="bg-cream pb-6">
      <SiteShell padding="grid">
        <Grid12>
          <section className="bg-off-white col-span-12 min-w-0 p-6 md:p-10 lg:p-12">
            <h2 className="text-off-black mb-10 font-sans text-[1.375rem] leading-none font-bold tracking-normal uppercase">
              {sectionHeading}
            </h2>
            <PortableText components={richTextComponents} value={body} />
          </section>
        </Grid12>
      </SiteShell>
    </SectionBand>
  )
}

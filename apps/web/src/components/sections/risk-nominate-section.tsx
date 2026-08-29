import {
  defaultComponents,
  mergeComponents,
  PortableText,
  type PortableTextComponents,
} from '@portabletext/react'
import type {ReactNode} from 'react'

import {contentLinkMark} from '@/components/content/portable-text-link'
import {sectionBodyRichTextComponents} from '@/components/content/section-body-rich-text'
import {ContentLink} from '@/components/content-link'
import {Grid12, SectionBand, SiteShell} from '@/components/layout'
import {Button} from '@/components/ui/button'
import type {RiskNominateSectionProps} from '@/lib/mappers/data-preservation-sections'

/** Nominate card body: Figtree Medium 22 / 28. */
const cardBodyPortableTextComponents: Partial<PortableTextComponents> = {
  block: {
    normal: ({children}: {children?: ReactNode}) => (
      <p className="font-sans text-[1.375rem] leading-7 font-medium text-dark-blue last:mb-0">
        {children}
      </p>
    ),
  },
  marks: {
    strong: ({children}: {children?: ReactNode}) => (
      <strong className="font-semibold">{children}</strong>
    ),
    link: contentLinkMark('text-dark-blue'),
  },
}

const cardBodyRichTextComponents = mergeComponents(
  defaultComponents,
  cardBodyPortableTextComponents,
)

/**
 * `riskNominateSection` CMS block.
 * Text + required light-blue nominate card. Stacks on small screens.
 * Left text inset matches the Data Preservation hero (`lg:ps-16` on desktop;
 * standard site-shell padding on smaller screens).
 */
export function RiskNominateSection({
  sectionHeading,
  body,
  cardHeading,
  cardBody,
  ctaLabel,
  href,
  external,
}: RiskNominateSectionProps) {
  const headingId = 'risk-nominate-heading'

  return (
    <SectionBand className="bg-off-white" aria-labelledby={headingId}>
      <SiteShell padding="none" className="bg-cream px-[var(--site-padding-x)] py-12 md:py-16">
        <Grid12 className="items-start gap-y-10">
          <div className="col-span-12 min-w-0 lg:col-span-6 lg:ps-16">
            <h2 id={headingId} className="section-label-heading text-off-black mb-8">
              {sectionHeading}
            </h2>
            <PortableText components={sectionBodyRichTextComponents} value={body} />
          </div>

          <aside className="col-span-12 flex min-w-0 flex-col bg-light-blue px-7 pt-7 pb-8 text-dark-blue lg:col-span-5 lg:col-start-8 lg:px-10 lg:pt-10 lg:pb-10">
            <h3 className="border-b-2 border-dark-blue/20 pb-7 font-serif text-[1.625rem] leading-none font-semibold italic tracking-normal text-dark-blue lg:pb-10">
              {cardHeading}
            </h3>
            <div className="mt-7 grow lg:mt-10">
              <PortableText components={cardBodyRichTextComponents} value={cardBody} />
            </div>
            {href ? (
              <div className="mt-7 flex justify-center">
                <Button asChild variant="offWhite" size="cta" className="px-6">
                  <ContentLink href={href} external={external}>
                    {ctaLabel}
                  </ContentLink>
                </Button>
              </div>
            ) : null}
          </aside>
        </Grid12>
      </SiteShell>
    </SectionBand>
  )
}

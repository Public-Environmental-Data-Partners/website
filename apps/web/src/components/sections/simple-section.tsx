import {PortableText} from '@portabletext/react'

import {sectionBodyRichTextComponents} from '@/components/content/section-body-rich-text'
import {ContentStack, Grid12, SectionBand, SiteShell} from '@/components/layout'
import {
  SIMPLE_SECTION_BACKGROUND_CLASS,
  type SimpleSectionProps,
} from '@/lib/mappers/simple-section'

export type {SimpleSectionProps}

/**
 * `simpleSection` CMS block.
 * Homepage-style section heading (full width) plus 12 / 12 / 6 body copy.
 */
export function SimpleSection({
  sectionHeading,
  body,
  background,
  headingId = 'simple-section-heading',
}: SimpleSectionProps) {
  return (
    <SectionBand
      className={SIMPLE_SECTION_BACKGROUND_CLASS[background]}
      aria-labelledby={headingId}
    >
      <SiteShell>
        <ContentStack>
          <h2
            id={headingId}
            className="section-label-heading text-muted-foreground text-center md:text-left"
          >
            {sectionHeading}
          </h2>
          <Grid12>
            <div className="col-span-12 min-w-0 lg:col-span-6">
              <PortableText components={sectionBodyRichTextComponents} value={body} />
            </div>
          </Grid12>
        </ContentStack>
      </SiteShell>
    </SectionBand>
  )
}

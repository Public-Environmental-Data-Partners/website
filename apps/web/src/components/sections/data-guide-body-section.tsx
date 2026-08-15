import {
  defaultComponents,
  mergeComponents,
  PortableText,
  type PortableTextComponents,
} from '@portabletext/react'
import type {ReactNode} from 'react'

import {contentLinkMark} from '@/components/content/portable-text-link'
import {sectionBodyPortableTextComponents} from '@/components/content/section-body-rich-text'
import {Grid12, SectionBand, SiteShell} from '@/components/layout'
import type {DataGuideBodyProps} from '@/lib/mappers/data-guide-sections'

const bodyPortableTextComponents: Partial<PortableTextComponents> = {
  ...sectionBodyPortableTextComponents,
  block: {
    ...sectionBodyPortableTextComponents.block,
    h2: ({children}: {children?: ReactNode}) => (
      <h2 className="text-off-black mt-10 mb-4 font-serif text-[1.75rem] leading-tight font-medium tracking-normal first:mt-0">
        {children}
      </h2>
    ),
    h3: ({children}: {children?: ReactNode}) => (
      <h3 className="text-off-black mt-8 mb-3 font-serif text-[1.375rem] leading-tight font-medium tracking-normal first:mt-0">
        {children}
      </h3>
    ),
  },
  marks: {
    ...sectionBodyPortableTextComponents.marks,
    link: contentLinkMark('text-off-black underline underline-offset-2'),
  },
}

const richTextComponents = mergeComponents(defaultComponents, bodyPortableTextComponents)

/**
 * `dataGuideBody` CMS block.
 * Same SiteShell and desktop indent as the Data Guide hero, without the green bleed.
 */
export function DataGuideBodySection({body}: DataGuideBodyProps) {
  return (
    <SectionBand className="bg-white">
      <SiteShell padding="none" className="px-[var(--site-padding-x)] py-10 md:py-14">
        <div className="xl:ps-[calc(56px+0.75rem)]">
          <Grid12>
            <div className="col-span-12 min-w-0 lg:col-span-7">
              <PortableText components={richTextComponents} value={body} />
            </div>
          </Grid12>
        </div>
      </SiteShell>
    </SectionBand>
  )
}

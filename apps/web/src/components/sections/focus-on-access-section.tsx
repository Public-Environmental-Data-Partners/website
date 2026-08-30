import {
  defaultComponents,
  mergeComponents,
  PortableText,
  type PortableTextComponents,
} from '@portabletext/react'
import Image from 'next/image'
import type {ReactNode} from 'react'

import {contentLinkMark} from '@/components/content/portable-text-link'
import {ContentStack, SectionBand, SiteShell} from '@/components/layout'
import type {FocusOnAccessSectionProps} from '@/lib/mappers/data-preservation-sections'

const bodyPortableTextComponents: Partial<PortableTextComponents> = {
  block: {
    normal: ({children}: {children?: ReactNode}) => (
      <p className="font-sans text-[1.125rem] leading-snug font-normal text-off-black last:mb-0">
        {children}
      </p>
    ),
  },
  marks: {
    strong: ({children}: {children?: ReactNode}) => (
      <strong className="font-semibold">{children}</strong>
    ),
    link: contentLinkMark('text-off-black underline-offset-[0.2em]'),
  },
}

const richTextComponents = mergeComponents(defaultComponents, bodyPortableTextComponents)

/**
 * `focusOnAccessSection` CMS block.
 * Full-bleed light green. Stacked on small screens; 4 columns at `lg`.
 */
export function FocusOnAccessSection({sectionHeading, items}: FocusOnAccessSectionProps) {
  const headingId = 'focus-on-access-heading'

  return (
    <SectionBand className="bg-light-green" aria-labelledby={headingId}>
      <SiteShell className="py-12 md:py-16">
        <ContentStack className="gap-10 md:gap-12">
          <h2 id={headingId} className="section-label-heading text-off-black">
            {sectionHeading}
          </h2>
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {items.map((item) => (
              <article key={item.keyId} className="flex flex-col items-center text-center">
                <div className="mb-6 flex h-[131px] w-[150px] shrink-0 items-center justify-center md:mb-8">
                  <Image
                    src={item.iconSrc}
                    alt=""
                    width={150}
                    height={131}
                    className="h-full w-full object-contain"
                    unoptimized
                  />
                </div>
                <h3 className="mb-4 font-sans text-[1.125rem] font-bold tracking-wide text-off-black uppercase">
                  {item.heading}
                </h3>
                <div className="w-full text-left">
                  <PortableText components={richTextComponents} value={item.body} />
                </div>
              </article>
            ))}
          </div>
        </ContentStack>
      </SiteShell>
    </SectionBand>
  )
}

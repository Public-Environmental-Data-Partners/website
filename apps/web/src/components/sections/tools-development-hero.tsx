import {
  defaultComponents,
  mergeComponents,
  PortableText,
  type PortableTextComponents,
} from '@portabletext/react'
import Image from 'next/image'

import {contentLinkMark} from '@/components/content/portable-text-link'
import {ContentStack, Grid12, SectionBand, SiteShell} from '@/components/layout'
import type {ToolsDevelopmentHeroProps} from '@/lib/mappers/tools-development'
import {cn} from '@/lib/utils'

const bodyPortableTextComponents: Partial<PortableTextComponents> = {
  block: {
    normal: ({children}: {children?: React.ReactNode}) => (
      <p className="text-off-black mb-4 font-sans text-[1.375rem] leading-none font-normal tracking-normal last:mb-0">
        {children}
      </p>
    ),
  },
  marks: {
    strong: ({children}: {children?: React.ReactNode}) => (
      <strong className="font-semibold">{children}</strong>
    ),
    link: contentLinkMark(
      'text-off-black underline underline-offset-2 transition-opacity hover:opacity-80',
    ),
  },
}

const richTextComponents = mergeComponents(defaultComponents, bodyPortableTextComponents)

/**
 * Tools Development hero: section heading, heading, body + Focus areas panel.
 * Desktop/tablet (`md+`): 6/6. Mobile: stacked.
 */
export function ToolsDevelopmentHero({
  sectionHeading,
  heading,
  body,
  focusAreasHeading,
  focusAreas,
}: ToolsDevelopmentHeroProps) {
  const headingId = 'tools-development-hero-heading'

  return (
    <SectionBand className="bg-cream" aria-labelledby={headingId}>
      <SiteShell padding="grid" className="relative py-10 md:py-14">
        {/* Desktop-only accent: full hero height (touches nav) + left bleed to viewport edge. */}
        <div
          aria-hidden
          className={cn(
            'bg-pedp-green pointer-events-none absolute top-0 bottom-0 hidden lg:block',
            'left-[calc(-1*var(--site-padding-x-md))] w-[calc(var(--site-padding-x-md)+0.25rem)]',
            'min-[87.5rem]:left-[calc(-1*(100vw-var(--max-width-site))/2)]',
            'min-[87.5rem]:w-[calc((100vw-var(--max-width-site))/2+0.25rem)]',
          )}
        />
        <Grid12 className="items-start gap-y-10">
          <div className="col-span-12 pl-5 md:col-span-6 md:pl-6">
            <ContentStack className="gap-5 md:gap-6">
              <p className="text-off-black m-0 font-sans text-[1.375rem] leading-none font-bold tracking-normal uppercase">
                {sectionHeading}
              </p>
              <h1 id={headingId} className="tools-development-heading text-off-black tracking-normal">
                {heading}
              </h1>
              <div>
                <PortableText components={richTextComponents} value={body} />
              </div>
            </ContentStack>
          </div>

          <aside
            className={cn(
              'bg-light-green col-span-12 flex flex-col px-6 py-8 md:col-span-6 md:px-8 md:py-10',
            )}
            aria-label={focusAreasHeading}
          >
            <h2 className="text-dark-green -mx-6 mb-8 border-b-2 border-dark-green/20 px-6 pb-2 text-left font-serif text-[1.75rem] leading-none font-medium italic tracking-normal md:-mx-8 md:mb-10 md:px-8">
              {focusAreasHeading}
            </h2>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-8 sm:gap-x-8 md:grid-cols-3">
              {focusAreas.map((item) => (
                <li key={item.keyId} className="flex flex-col items-center gap-3 text-center">
                  <Image
                    src={item.iconSrc}
                    alt=""
                    width={56}
                    height={56}
                    className="h-14 w-14 object-contain"
                    unoptimized
                  />
                  <span className="text-dark-green font-sans text-sm leading-none font-semibold tracking-normal uppercase">
                    {item.title}
                  </span>
                </li>
              ))}
            </ul>
          </aside>
        </Grid12>
      </SiteShell>
    </SectionBand>
  )
}

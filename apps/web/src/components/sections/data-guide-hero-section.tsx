import {
  defaultComponents,
  mergeComponents,
  PortableText,
  type PortableTextComponents,
} from '@portabletext/react'
import {ChevronLeft} from 'lucide-react'
import type {ReactNode} from 'react'

import {ContentLink} from '@/components/content-link'
import {contentLinkClass, contentLinkMark} from '@/components/content/portable-text-link'
import {Grid12, SectionBand, SiteShell} from '@/components/layout'
import type {DataGuideHeroProps} from '@/lib/mappers/data-guide-sections'
import {BODY_LG_CLASS, SITE_PAGE_HERO_HEADING_CLASS} from '@/lib/typography'
import {cn} from '@/lib/utils'

const DATA_CATALOG_PATH = '/data-catalog'

const introPortableTextComponents: Partial<PortableTextComponents> = {
  block: {
    normal: ({children}: {children?: ReactNode}) => (
      <p className={cn(BODY_LG_CLASS, 'font-normal text-dark-green last:mb-0')}>{children}</p>
    ),
  },
  marks: {
    strong: ({children}: {children?: ReactNode}) => (
      <strong className="font-semibold">{children}</strong>
    ),
    em: ({children}: {children?: ReactNode}) => <em>{children}</em>,
    link: contentLinkMark('text-dark-green'),
  },
}

const introRichTextComponents = mergeComponents(defaultComponents, introPortableTextComponents)

/**
 * `dataGuideHero` CMS block.
 * Same shell, left bleed, desktop indent, and vertical padding as the Data Catalog hero.
 */
export function DataGuideHeroSection({pageTitle, body}: DataGuideHeroProps) {
  const headingId = 'data-guide-heading'

  return (
    <SectionBand className="bg-pale-green" aria-labelledby={headingId}>
      <SiteShell padding="none" className="relative px-[var(--site-padding-x)] py-10 md:py-14">
        <div
          aria-hidden
          className={cn(
            'bg-light-green pointer-events-none absolute top-0 bottom-0',
            'left-[calc(-1*var(--site-padding-x))] w-[calc(var(--site-padding-x)+0.25rem)]',
            'min-[87.5rem]:left-[calc(-1*((100vw-var(--max-width-site))/2+var(--site-padding-x)))]',
            'min-[87.5rem]:w-[calc((100vw-var(--max-width-site))/2+var(--site-padding-x)+0.25rem)]',
          )}
        />
        <div className="xl:ps-[calc(56px+0.75rem)]">
          <Grid12>
            <div className="col-span-12 min-w-0 lg:col-span-7">
              <ContentLink
                href={DATA_CATALOG_PATH}
                className={cn(
                  BODY_LG_CLASS,
                  'mb-3 inline-flex min-h-11 max-w-full items-center gap-1 font-normal text-dark-green transition-opacity hover:opacity-80',
                )}
              >
                <ChevronLeft className="size-5 shrink-0" aria-hidden />
                <span className={contentLinkClass}>Data catalog</span>
              </ContentLink>
              <h1 id={headingId} className={cn(SITE_PAGE_HERO_HEADING_CLASS, 'text-dark-green')}>
                {pageTitle}
              </h1>
              <div className="mt-4 space-y-4">
                <PortableText components={introRichTextComponents} value={body} />
              </div>
            </div>
          </Grid12>
        </div>
      </SiteShell>
    </SectionBand>
  )
}

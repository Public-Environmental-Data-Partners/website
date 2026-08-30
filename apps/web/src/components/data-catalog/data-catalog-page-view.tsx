import {
  defaultComponents,
  mergeComponents,
  PortableText,
  type PortableTextBlock,
  type PortableTextComponents,
} from '@portabletext/react'
import type {ReactNode} from 'react'

import {contentLinkMark} from '@/components/content/portable-text-link'
import {DataCatalogExplorer} from '@/components/data-catalog/data-catalog-explorer'
import {SectionBand, SiteShell} from '@/components/layout'
import type {CatalogCardProps, CatalogCtaProps} from '@/lib/mappers/catalog-dataset'
import {cn} from '@/lib/utils'

const introPortableTextComponents: Partial<PortableTextComponents> = {
  block: {
    normal: ({children}: {children?: ReactNode}) => (
      <p data-slot="data-catalog-hero-intro" className="text-dark-green last:mb-0">
        {children}
      </p>
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

export function DataCatalogPageView({
  title,
  intro,
  datasets,
  dataGuide,
  nominateData,
}: {
  title: string
  intro: PortableTextBlock[] | null
  datasets: CatalogCardProps[]
  dataGuide: CatalogCtaProps | null
  nominateData: CatalogCtaProps | null
}) {
  return (
    <div data-slot="data-catalog">
      <SectionBand className="bg-pale-green" aria-labelledby="data-catalog-title">
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
            <h1
              id="data-catalog-title"
              data-slot="data-catalog-hero-title"
              className="text-dark-green"
            >
              {title}
            </h1>
            {intro && intro.length > 0 ? (
              <div className="mt-4 max-w-[52rem]">
                <PortableText components={introRichTextComponents} value={intro} />
              </div>
            ) : null}
          </div>
        </SiteShell>
      </SectionBand>
      <SectionBand className="bg-white py-10 md:py-14">
        <SiteShell padding="grid">
          <DataCatalogExplorer
            datasets={datasets}
            dataGuide={dataGuide}
            nominateData={nominateData}
          />
        </SiteShell>
      </SectionBand>
    </div>
  )
}

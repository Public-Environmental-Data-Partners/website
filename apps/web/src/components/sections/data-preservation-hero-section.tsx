import {PortableText} from '@portabletext/react'
import Image from 'next/image'

import {sectionBodyRichTextComponents} from '@/components/content/section-body-rich-text'
import {ContentLink} from '@/components/content-link'
import {Grid12, SectionBand, SiteShell} from '@/components/layout'
import {Button} from '@/components/ui/button'
import type {DataPreservationHeroProps} from '@/lib/mappers/data-preservation-sections'
import {SECTION_LABEL_HEADING_CLASS} from '@/lib/typography'
import {cn} from '@/lib/utils'

const HERO_IMAGE_SIZES = '(min-width: 1024px) 25vw, 0px'

/**
 * `dataPreservationHero` CMS block.
 * Left rail outside the shell: off-white. Inside the shell: cream (text) | beige
 * (images), with beige continuing into the right viewport rail. Desktop: 6-col
 * text + 3+3 images flush to each other and to the top / left of the image column.
 */
export function DataPreservationHeroSection({
  pageTitle,
  eyebrow,
  heading,
  body,
  ctaLabel,
  href,
  external,
  fileListImage,
  collageImage,
}: DataPreservationHeroProps) {
  const label = eyebrow?.trim() || pageTitle
  const headingId = 'data-preservation-hero-heading'
  const showImages = Boolean(fileListImage || collageImage)

  return (
    <SectionBand className="relative bg-off-white" aria-labelledby={headingId}>
      {/* Right viewport half + rail: beige (desktop only — images hide below lg) */}
      <div
        className="pointer-events-none absolute inset-y-0 left-1/2 right-0 hidden bg-beige lg:block"
        aria-hidden
      />
      <SiteShell padding="none" className="relative px-[var(--site-padding-x)]">
        {/* Shell: full cream below lg; left half cream at lg+ (beige fills the right) */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 w-full bg-cream lg:w-1/2"
          aria-hidden
        />
        <Grid12 className="relative items-stretch gap-y-10 lg:gap-x-0">
          <div className="col-span-12 flex min-w-0 flex-col gap-6 py-10 md:py-14 lg:col-span-6 lg:py-16 lg:ps-16">
            <h1 className={cn(SECTION_LABEL_HEADING_CLASS, 'text-off-black')}>{label}</h1>
            <h2
              id={headingId}
              className="font-serif text-[2.5rem] leading-none font-medium tracking-normal text-off-black md:text-[3.25rem]"
            >
              {heading}
            </h2>
            <div className="mt-6 max-w-xl md:mt-8">
              <PortableText components={sectionBodyRichTextComponents} value={body} />
            </div>
            {href && ctaLabel ? (
              <div className="mt-8 flex justify-center">
                <Button asChild variant="lightBlue" size="cta" className="px-6">
                  <ContentLink href={href} external={external}>
                    {ctaLabel}
                  </ContentLink>
                </Button>
              </div>
            ) : null}
          </div>

          {showImages ? (
            <div className="col-span-12 hidden min-h-0 min-w-0 lg:col-span-6 lg:grid lg:grid-cols-2">
              {fileListImage ? (
                <div className="relative h-full min-h-0 overflow-hidden">
                  <Image
                    src={fileListImage.src}
                    alt={fileListImage.alt}
                    fill
                    className="object-cover object-left-top"
                    sizes={HERO_IMAGE_SIZES}
                    priority
                  />
                </div>
              ) : (
                <div />
              )}
              {collageImage ? (
                <div className="relative h-full min-h-0 overflow-hidden">
                  <Image
                    src={collageImage.src}
                    alt={collageImage.alt}
                    fill
                    className="object-cover object-left-top"
                    sizes={HERO_IMAGE_SIZES}
                    priority
                  />
                </div>
              ) : null}
            </div>
          ) : null}
        </Grid12>
      </SiteShell>
    </SectionBand>
  )
}

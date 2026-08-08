import {PortableText} from '@portabletext/react'
import Image from 'next/image'

import {sectionBodyRichTextComponents} from '@/components/content/section-body-rich-text'
import {ContentLink} from '@/components/content-link'
import {Grid12, SectionBand, SiteShell} from '@/components/layout'
import {Button} from '@/components/ui/button'
import {
  METADATA_STANDARDS_IMAGE_SIZES,
  type MetadataStandardsSectionProps,
} from '@/lib/mappers/data-preservation-sections'

/**
 * `metadataStandardsSection` CMS block.
 * Split full-bleed (light-green | light-blue). Image left and text right are
 * flush to the site shell, touch in the middle (`lg:gap-x-0`), and share height.
 */
export function MetadataStandardsSection({
  sectionHeading,
  body,
  image,
  ctaLabel,
  href,
  external,
}: MetadataStandardsSectionProps) {
  const headingId = 'metadata-standards-heading'

  return (
    <SectionBand className="relative" aria-labelledby={headingId}>
      <div className="pointer-events-none absolute inset-0 flex" aria-hidden>
        <div className="w-1/2 bg-light-green" />
        <div className="w-1/2 bg-light-blue" />
      </div>
      <SiteShell padding="none" className="relative px-[var(--site-padding-x)]">
        <Grid12 className="items-stretch gap-y-0 lg:gap-x-0">
          <div className="col-span-12 min-h-0 min-w-0 lg:col-span-6">
            <div className="relative aspect-[688/872] h-full min-h-0 w-full overflow-hidden lg:aspect-auto">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover object-left-top"
                sizes={METADATA_STANDARDS_IMAGE_SIZES}
              />
            </div>
          </div>
          <div className="col-span-12 flex min-w-0 flex-col gap-8 bg-cream px-6 py-10 sm:px-8 lg:col-span-6 lg:px-10 lg:py-12">
            <h2 id={headingId} className="section-label-heading text-off-black">
              {sectionHeading}
            </h2>
            <PortableText components={sectionBodyRichTextComponents} value={body} />
            {href && ctaLabel ? (
              <div className="flex justify-center">
                <Button
                  asChild
                  size="cta"
                  className="bg-light-green px-6 text-forest hover:bg-light-green/90"
                >
                  <ContentLink href={href} external={external}>
                    {ctaLabel}
                  </ContentLink>
                </Button>
              </div>
            ) : null}
          </div>
        </Grid12>
      </SiteShell>
    </SectionBand>
  )
}

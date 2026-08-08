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
import {ImageWithShelf} from '@/components/media/image-with-shelf'
import {Button} from '@/components/ui/button'
import type {AdvocacyHeroProps} from '@/lib/mappers/advocacy-sections'
import {SECTION_LABEL_HEADING_CLASS, SITE_PAGE_HERO_HEADING_CLASS} from '@/lib/typography'
import {cn} from '@/lib/utils'

/** Approach card body: Figtree Medium 22 / 28 (matches Nominate card). */
const cardBodyPortableTextComponents: Partial<PortableTextComponents> = {
  block: {
    normal: ({children}: {children?: ReactNode}) => (
      <p className="font-sans text-[1.375rem] leading-7 font-medium text-off-black last:mb-0">
        {children}
      </p>
    ),
  },
  marks: {
    strong: ({children}: {children?: ReactNode}) => (
      <strong className="font-semibold">{children}</strong>
    ),
    link: contentLinkMark('text-off-black underline underline-offset-2'),
  },
}

const cardBodyRichTextComponents = mergeComponents(
  defaultComponents,
  cardBodyPortableTextComponents,
)

const HERO_IMAGE_SIZES = '(min-width: 1024px) 45vw, 0px'

/**
 * `advocacyHero` CMS block.
 * Light-green viewport rails outside the cream shell. Left: page-title eyebrow,
 * heading, body. Right (lg+): shelf image flush to the top and right of the site
 * shell, then beige Our Approach card. Below lg: text then card; image hidden.
 */
export function AdvocacyHeroSection({
  pageTitle,
  heading,
  body,
  image,
  imageShelf,
  cardHeading,
  cardBody,
  ctaLabel,
  href,
  external,
}: AdvocacyHeroProps) {
  const headingId = 'advocacy-hero-heading'

  const approachCard = (
    <aside className="flex min-w-0 flex-col bg-light-beige px-7 pt-7 pb-8 text-off-black lg:px-10 lg:pt-10 lg:pb-10">
      <h3 className="border-b-2 border-off-black/20 pb-7 font-serif text-[1.625rem] leading-none font-semibold italic tracking-normal text-off-black lg:pb-10">
        {cardHeading}
      </h3>
      <div className="mt-7 grow lg:mt-10">
        <PortableText components={cardBodyRichTextComponents} value={cardBody} />
      </div>
      {href && ctaLabel ? (
        <div className="mt-7 flex justify-center">
          <Button asChild variant="offWhite" size="cta" className="px-6">
            <ContentLink href={href} external={external}>
              {ctaLabel}
            </ContentLink>
          </Button>
        </div>
      ) : null}
    </aside>
  )

  return (
    <SectionBand className="bg-light-green" aria-labelledby={headingId}>
      <SiteShell
        padding="none"
        className="bg-cream px-[var(--site-padding-x)] py-10 md:py-14 lg:py-0 lg:pe-0"
      >
        <Grid12 className="items-start gap-y-10">
          <div className="col-span-12 min-w-0 lg:col-span-6 lg:py-16 lg:ps-16">
            <h1 className={cn(SECTION_LABEL_HEADING_CLASS, 'text-off-black')}>{pageTitle}</h1>
            <h2
              id={headingId}
              className={cn(SITE_PAGE_HERO_HEADING_CLASS, 'text-off-black mt-6 md:mt-8')}
            >
              {heading}
            </h2>
            <div className="mt-6 max-w-xl md:mt-8">
              <PortableText components={sectionBodyRichTextComponents} value={body} />
            </div>
          </div>

          <div className="col-span-12 flex min-w-0 flex-col gap-8 lg:col-span-6">
            {image ? (
              <ImageWithShelf
                className="hidden lg:block"
                fetchPriority="high"
                image={image}
                shelf={imageShelf}
                sizes={HERO_IMAGE_SIZES}
              />
            ) : null}
            {/* Restore shell inset on the card so only the image is flush right. */}
            <div className="lg:pe-[var(--site-padding-x)] lg:pb-16">{approachCard}</div>
          </div>
        </Grid12>
      </SiteShell>
    </SectionBand>
  )
}

import {
  defaultComponents,
  mergeComponents,
  PortableText,
  type PortableTextComponents,
} from '@portabletext/react'
import {getImageProps} from 'next/image'

import {contentLinkMark} from '@/components/content/portable-text-link'
import {ContentLink} from '@/components/content-link'
import {SectionBand, SiteShell} from '@/components/layout'
import {Button} from '@/components/ui/button'
import type {HighlightBannerSectionProps} from '@/lib/mappers/highlight-banner-section'

export type {HighlightBannerSectionProps}

function imageDimension(value: number | undefined, fallback: number) {
  return typeof value === 'number' && value > 0 ? value : fallback
}

function BannerImageBlock({image}: Pick<HighlightBannerSectionProps, 'image'>) {
  const w = imageDimension(image.width, 1200)
  const h = imageDimension(image.height, 800)
  const {props} = getImageProps({
    src: image.src,
    alt: image.alt,
    width: w,
    height: h,
    sizes: '(max-width: 767px) 100vw, 50vw',
  })
  return (
    // eslint-disable-next-line @next/next/no-img-element -- getImageProps + native img keeps layout/CSS control in the aspect-ratio wrapper
    <img
      {...props}
      alt={image.alt}
      className="h-full w-full object-cover"
      loading="lazy"
      decoding="async"
    />
  )
}

const bodyPortableTextComponents: Partial<PortableTextComponents> = {
  block: {
    normal: ({children}: {children?: React.ReactNode}) => (
      <p className="font-sans text-2xl leading-none font-normal text-light-green last:mb-0 lg:font-serif lg:text-[2.5rem]">
        {children}
      </p>
    ),
  },
  marks: {
    strong: ({children}: {children?: React.ReactNode}) => (
      <strong className="font-semibold">{children}</strong>
    ),
    link: contentLinkMark('text-light-green underline-offset-[0.2em]'),
  },
}

const richTextComponents = mergeComponents(defaultComponents, bodyPortableTextComponents)

function HighlightCta({label, href, external}: {label: string; href: string; external?: boolean}) {
  return (
    <Button asChild variant="lightGreen" size="cta" className="text-forest">
      <ContentLink href={href} external={external}>
        {label}
      </ContentLink>
    </Button>
  )
}

/**
 * Simple forest highlight band: inset image, section heading / title / body, CTA.
 * Mobile: stack. Tablet: image | copy, CTA under image. Desktop: image | copy, title hidden, CTA under copy.
 */
export function HighlightBannerSection({
  sectionHeading,
  heading,
  body,
  ctaLabel,
  ctaHref,
  ctaExternal,
  image,
}: HighlightBannerSectionProps) {
  const headingId = 'highlight-banner-heading'
  const showCta = Boolean(ctaHref && ctaLabel)

  return (
    <SectionBand className="bg-forest" aria-labelledby={headingId}>
      <SiteShell>
        <div className="flex flex-col gap-8 md:grid md:grid-cols-2 md:items-start md:gap-10 lg:gap-14">
          <div className="flex flex-col gap-8">
            <div className="overflow-hidden">
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <BannerImageBlock image={image} />
              </div>
            </div>
            {/* Tablet: CTA under image */}
            {showCta ? (
              <div className="hidden justify-center md:flex lg:hidden">
                <HighlightCta href={ctaHref!} label={ctaLabel!} external={ctaExternal} />
              </div>
            ) : null}
          </div>

          <div className="flex min-w-0 flex-col">
            <p className="font-sans text-[1.375rem] leading-none font-semibold tracking-normal text-light-green uppercase lg:font-bold">
              {sectionHeading}
            </p>
            <h2
              id={headingId}
              className="mt-4 font-sans text-[2.5rem] leading-none font-normal tracking-normal text-light-green lg:hidden"
            >
              {heading}
            </h2>
            <div className="mt-4 space-y-4 lg:mt-6">
              <PortableText value={body as never} components={richTextComponents} />
            </div>
            {/* Mobile: centered CTA under copy */}
            {showCta ? (
              <div className="mt-10 flex justify-center md:hidden">
                <HighlightCta href={ctaHref!} label={ctaLabel!} external={ctaExternal} />
              </div>
            ) : null}
            {/* Desktop: CTA under copy */}
            {showCta ? (
              <div className="mt-10 hidden lg:block">
                <HighlightCta href={ctaHref!} label={ctaLabel!} external={ctaExternal} />
              </div>
            ) : null}
          </div>
        </div>
      </SiteShell>
    </SectionBand>
  )
}

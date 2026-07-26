import {
  defaultComponents,
  mergeComponents,
  PortableText,
  type PortableTextBlock,
  type PortableTextComponents,
} from '@portabletext/react'
import Image from 'next/image'

import {contentLinkMark} from '@/components/content/portable-text-link'
import {ContentLink} from '@/components/content-link'
import {SectionBand, SiteShell} from '@/components/layout'
import {Button} from '@/components/ui/button'
import {
  TESTIMONIAL_QUOTE_ICON_SRC_BY_SURFACE,
  type TestimonialSectionProps,
} from '@/lib/mappers/testimonial-section'

/** Colors inherit from the band so one set of components serves both surfaces. */
const quotePortableTextComponents: Partial<PortableTextComponents> = {
  block: {
    normal: ({children}: {children?: React.ReactNode}) => (
      <p className="font-sans text-[2.5rem] leading-[2.875rem] font-normal last:mb-0">{children}</p>
    ),
  },
  marks: {
    strong: ({children}: {children?: React.ReactNode}) => (
      <strong className="font-semibold">{children}</strong>
    ),
    link: contentLinkMark('underline underline-offset-[0.2em] transition-opacity hover:opacity-80'),
  },
}

const richTextComponents = mergeComponents(defaultComponents, quotePortableTextComponents)

function QuoteBody({value}: {value: PortableTextBlock[]}) {
  return <PortableText components={richTextComponents} value={value} />
}

/**
 * `testimonialSection` CMS block.
 * Mobile: section heading + small icon · quote · centered CTA.
 * Desktop (`lg+`): large icon | section heading + quote (+ optional name) | CTA.
 */
export function TestimonialSection({
  sectionHeading,
  quote,
  attribution,
  ctaLabel,
  surface,
  href,
  external,
}: TestimonialSectionProps) {
  const headingId = 'testimonial-heading'
  const isLight = surface === 'light'

  return (
    <SectionBand
      className={isLight ? 'bg-light-blue text-dark-blue' : 'bg-dark-blue text-light-blue'}
      aria-labelledby={headingId}
    >
      <SiteShell className="py-12 md:py-20">
        <div className="grid grid-cols-[1fr_auto] items-start gap-x-4 gap-y-8 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:gap-x-14 lg:gap-y-8">
          <h2
            id={headingId}
            className="col-start-1 row-start-1 font-sans text-2xl leading-none font-semibold tracking-normal uppercase lg:col-start-2"
          >
            {sectionHeading}
          </h2>

          <Image
            src={TESTIMONIAL_QUOTE_ICON_SRC_BY_SURFACE[surface]}
            alt=""
            width={200}
            height={200}
            className="col-start-2 row-start-1 h-10 w-10 object-contain lg:col-start-1 lg:row-span-2 lg:h-[200px] lg:w-[200px]"
            unoptimized
          />

          <div className="col-span-2 row-start-2 space-y-4 lg:col-span-1 lg:col-start-2 lg:row-start-2">
            <QuoteBody value={quote} />
            {attribution ? (
              <p className="font-sans text-[1.125rem] font-medium opacity-90">— {attribution}</p>
            ) : null}
          </div>

          {href ? (
            <div className="col-span-2 row-start-3 flex justify-center lg:col-span-1 lg:col-start-3 lg:row-span-2 lg:row-start-1 lg:self-center lg:justify-end">
              <Button asChild variant={isLight ? 'darkBlue' : 'lightBlue'} size="cta">
                <ContentLink href={href} external={external}>
                  {ctaLabel}
                </ContentLink>
              </Button>
            </div>
          ) : null}
        </div>
      </SiteShell>
    </SectionBand>
  )
}

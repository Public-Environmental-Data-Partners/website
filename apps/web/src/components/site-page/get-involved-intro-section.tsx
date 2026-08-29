import {
  defaultComponents,
  mergeComponents,
  PortableText,
  type PortableTextBlock,
  type PortableTextComponents,
  type PortableTextTypeComponentProps,
} from '@portabletext/react'
import Image from 'next/image'
import type {ReactNode} from 'react'

import {contentLinkMark} from '@/components/content/portable-text-link'
import {ContentLink} from '@/components/content-link'
import type {HeroImage} from '@/components/hero/hero-image'
import {Grid12, SectionBand} from '@/components/layout'
import {type ContactCtaBlock} from '@/components/site-page/contact-section'
import {Button} from '@/components/ui/button'
import {resolveContentLink} from '@/lib/content-link'

type GetInvolvedIntroSectionProps = {
  title: string
  heading: string
  callout: Array<PortableTextBlock | ContactCtaBlock>
  image: HeroImage
  body: PortableTextBlock[]
}

function CalloutCta({value}: PortableTextTypeComponentProps<ContactCtaBlock>) {
  const label = value.label?.trim()
  const resolved = resolveContentLink(value.link)
  if (!label || !resolved) {
    return null
  }

  return (
    <div className="my-4 flex justify-center first:mt-0">
      <Button asChild variant="offWhite" size="cta" className="w-full max-w-[22rem]">
        <ContentLink href={resolved.href} external={resolved.external}>
          {label}
        </ContentLink>
      </Button>
    </div>
  )
}

const calloutPortableTextComponents: Partial<PortableTextComponents> = {
  block: {
    normal: ({children}: {children?: ReactNode}) => (
      <p className="text-foreground mb-6 font-sans text-[1.375rem] leading-7 font-medium tracking-normal last:mb-0">
        {children}
      </p>
    ),
  },
  marks: {
    strong: ({children}: {children?: ReactNode}) => (
      <strong className="font-semibold">{children}</strong>
    ),
    em: ({children}: {children?: ReactNode}) => <em className="italic">{children}</em>,
    link: contentLinkMark('text-dark-blue'),
  },
  types: {
    contactCta: CalloutCta,
  },
}

const bodyPortableTextComponents: Partial<PortableTextComponents> = {
  block: {
    normal: ({children}: {children?: ReactNode}) => (
      <p className="text-foreground mb-6 font-sans text-[1.375rem] leading-relaxed font-normal tracking-normal last:mb-0">
        {children}
      </p>
    ),
    h2: ({children}: {children?: ReactNode}) => (
      <h2 className="section-label-heading text-foreground mb-6 mt-10 first:mt-0">{children}</h2>
    ),
    h3: ({children}: {children?: ReactNode}) => (
      <h3 className="section-label-heading text-foreground mb-4 mt-8 first:mt-0">{children}</h3>
    ),
  },
  list: {
    bullet: ({children}: {children?: ReactNode}) => (
      <ul className="text-foreground mb-6 list-disc space-y-4 ps-6 font-sans text-[1.375rem] leading-relaxed font-normal last:mb-0">
        {children}
      </ul>
    ),
    number: ({children}: {children?: ReactNode}) => (
      <ol className="text-foreground mb-6 list-decimal space-y-4 ps-6 font-sans text-[1.375rem] leading-relaxed font-normal last:mb-0">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({children}: {children?: ReactNode}) => <li>{children}</li>,
    number: ({children}: {children?: ReactNode}) => <li>{children}</li>,
  },
  marks: {
    strong: ({children}: {children?: ReactNode}) => (
      <strong className="font-bold">{children}</strong>
    ),
    link: contentLinkMark('text-dark-blue'),
  },
}

const calloutRichText = mergeComponents(defaultComponents, calloutPortableTextComponents)
const bodyRichText = mergeComponents(defaultComponents, bodyPortableTextComponents)

/**
 * Get Involved intro: page title above the body (right); light-blue callout (left)
 * aligns with the body. Mobile: title → callout → body.
 */
export function GetInvolvedIntroSection({
  title,
  heading,
  callout,
  image,
  body,
}: GetInvolvedIntroSectionProps) {
  return (
    <SectionBand className="bg-off-white">
      {/* Cream panel is full-bleed below 1400 (no off-white sidebands) and caps at the
          1400 grid above it, where the off-white band shows as sidebands. */}
      <div className="bg-cream mx-auto w-full max-w-site">
        <div className="px-[var(--site-padding-x)] py-10 md:py-12 lg:px-10">
          <Grid12 className="gap-y-10 lg:gap-y-0 lg:gap-x-12">
            <h1 className="text-foreground col-span-12 min-w-0 font-sans text-[1.375rem] leading-none font-bold tracking-normal uppercase lg:col-span-5 lg:col-start-7 lg:row-start-1 lg:mb-8">
              {title}
            </h1>

            <div className="bg-light-blue col-span-12 min-w-0 self-start lg:col-span-6 lg:col-start-1 lg:row-start-2">
              <div className="flex flex-col px-6 pt-8 pb-6 md:px-8 md:pt-10">
                <h2 className="text-foreground mb-6 font-serif text-[1.625rem] leading-none font-semibold italic">
                  {heading}
                </h2>
                {callout.length > 0 ? (
                  <div className="min-w-0">
                    <PortableText components={calloutRichText} value={callout} />
                  </div>
                ) : null}
                <div className="mt-6 flex w-full justify-center">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={image.width ?? 416}
                    height={image.height ?? 312}
                    sizes="(max-width: 1023px) calc(100vw - 32px), 416px"
                    className="h-auto w-full max-w-[26rem] object-contain object-bottom lg:h-[19.5rem] lg:w-[26rem]"
                    priority
                  />
                </div>
              </div>
            </div>

            {body.length > 0 ? (
              <div className="col-span-12 min-w-0 lg:col-span-5 lg:col-start-7 lg:row-start-2">
                <PortableText components={bodyRichText} value={body} />
              </div>
            ) : null}
          </Grid12>
        </div>
      </div>
    </SectionBand>
  )
}

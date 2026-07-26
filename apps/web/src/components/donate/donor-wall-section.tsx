import {
  defaultComponents,
  mergeComponents,
  PortableText,
  type PortableTextBlock,
  type PortableTextComponents,
} from '@portabletext/react'

import {contentLinkMark} from '@/components/content/portable-text-link'
import {DonorboxEmbed} from '@/components/donate/donorbox-embed'
import {SectionBand, SiteShell} from '@/components/layout'
import type {DonorWallSectionProps} from '@/lib/mappers/donate-sections'

const einBodyComponents: Partial<PortableTextComponents> = {
  block: {
    normal: ({children}: {children?: React.ReactNode}) => (
      <p className="text-center font-sans text-sm leading-snug font-normal text-light-beige last:mb-0 md:text-base">
        {children}
      </p>
    ),
  },
  marks: {
    strong: ({children}: {children?: React.ReactNode}) => (
      <strong className="font-semibold">{children}</strong>
    ),
    link: contentLinkMark('underline underline-offset-2'),
  },
}

const richTextComponents = mergeComponents(defaultComponents, einBodyComponents)

/**
 * Full-width dark band with Donorbox Donor Wall embed.
 * Wall chrome is Donorbox-hosted; heading and EIN copy are ours.
 */
export function DonorWallSection({
  sectionHeading,
  embedUrl,
  isPlaceholder,
  body,
}: DonorWallSectionProps) {
  const headingId = 'donor-wall-heading'

  return (
    <SectionBand className="bg-dark-beige" aria-labelledby={headingId}>
      <SiteShell padding="grid" className="py-12 md:py-16">
        <h2
          id={headingId}
          className="text-left font-sans text-[1.375rem] leading-none font-bold tracking-normal text-light-beige uppercase"
        >
          {sectionHeading}
        </h2>
        <div className="mx-auto mt-8 w-full max-w-[500px] rounded-lg bg-off-white p-3 md:mt-10 md:p-4">
          <DonorboxEmbed
            title="Donor wall"
            embedUrl={embedUrl}
            isPlaceholder={isPlaceholder}
            variant="wall"
          />
        </div>
        <div className="mx-auto mt-8 max-w-3xl md:mt-10">
          <PortableText components={richTextComponents} value={body as PortableTextBlock[]} />
        </div>
      </SiteShell>
    </SectionBand>
  )
}

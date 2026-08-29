import {
  defaultComponents,
  mergeComponents,
  PortableText,
  type PortableTextBlock,
  type PortableTextComponents,
} from '@portabletext/react'

import {contentLinkMark} from '@/components/content/portable-text-link'
import {DonorboxEmbed} from '@/components/donate/donorbox-embed'
import type {DonateFormSectionProps} from '@/lib/mappers/donate-sections'

const legalBodyComponents: Partial<PortableTextComponents> = {
  block: {
    normal: ({children}: {children?: React.ReactNode}) => (
      <p className="text-foreground mb-4 font-sans text-sm leading-snug font-normal last:mb-0 md:text-base">
        {children}
      </p>
    ),
  },
  marks: {
    strong: ({children}: {children?: React.ReactNode}) => (
      <strong className="font-semibold">{children}</strong>
    ),
    link: contentLinkMark(),
  },
}

const richTextComponents = mergeComponents(defaultComponents, legalBodyComponents)

/** Left column: Donorbox form embed (425px) + legal copy, centered in the half-grid. */
export function DonateFormSection({embedUrl, isPlaceholder, body}: DonateFormSectionProps) {
  return (
    <div className="mx-auto w-full min-w-0 max-w-[425px]">
      <DonorboxEmbed
        title="Donation form"
        embedUrl={embedUrl}
        isPlaceholder={isPlaceholder}
        variant="form"
      />
      <div className="mt-6">
        <PortableText components={richTextComponents} value={body as PortableTextBlock[]} />
      </div>
    </div>
  )
}

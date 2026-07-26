import Image from 'next/image'

import {ContentStack, SectionBand, SiteShell} from '@/components/layout'
import {IconCard} from '@/components/sections/icon-card'
import {WHAT_WE_DO_ICON_SRC, type WhatWeDoSectionProps} from '@/lib/mappers/what-we-do-section'

/**
 * `whatWeDoSection` CMS block.
 * Mobile: 1 column. Tablet: 2 + 1 centered. Desktop: 3 columns.
 */
export function WhatWeDoSection({sectionHeading, items}: WhatWeDoSectionProps) {
  const headingId = 'what-we-do-heading'

  return (
    <SectionBand className="bg-off-white" aria-labelledby={headingId}>
      <SiteShell>
        <ContentStack className="gap-10 md:gap-12">
          <h2
            id={headingId}
            className="section-label-heading text-muted-foreground text-center md:text-left"
          >
            {sectionHeading}
          </h2>
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-x-12 md:gap-y-16 lg:grid-cols-3">
            {items.map((item, index) => (
              <IconCard
                key={item.keyId}
                icon={
                  <Image
                    src={WHAT_WE_DO_ICON_SRC[item.icon]}
                    alt=""
                    width={173}
                    height={173}
                    className="h-full w-full object-contain"
                    unoptimized
                  />
                }
                title={item.title}
                body={item.body}
                ctaLabel={item.ctaLabel}
                href={item.href}
                external={item.external}
                centerOnTablet={index === 2}
              />
            ))}
          </div>
        </ContentStack>
      </SiteShell>
    </SectionBand>
  )
}

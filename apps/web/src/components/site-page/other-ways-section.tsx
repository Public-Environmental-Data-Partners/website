import Image from 'next/image'

import {ContentStack, SectionBand, SiteShell} from '@/components/layout'
import {IconCard} from '@/components/sections/icon-card'
import type {OtherWaysSectionProps} from '@/lib/mappers/get-involved-sections'

/**
 * `otherWaysSection` CMS block.
 * Mobile: 1 column. Tablet: 2 + 1 centered. Desktop: 3 columns.
 */
export function OtherWaysSection({sectionHeading, cards}: OtherWaysSectionProps) {
  const headingId = 'other-ways-heading'

  return (
    <SectionBand className="bg-light-beige" aria-labelledby={headingId}>
      <SiteShell className="pt-[var(--section-padding-y)] pb-16 md:pt-[var(--section-padding-y-md)] md:pb-24">
        <ContentStack className="gap-10 md:gap-12">
          <h2 id={headingId} className="section-label-heading text-foreground text-left">
            {sectionHeading}
          </h2>
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-x-12 md:gap-y-16 lg:grid-cols-3">
            {cards.map((card, index) => (
              <IconCard
                key={card.keyId}
                bodyFullWidth
                icon={
                  <Image
                    src={card.icon.src}
                    alt={card.icon.alt}
                    width={card.icon.width ?? 173}
                    height={card.icon.height ?? 173}
                    className="h-full w-full object-contain"
                    unoptimized={card.icon.src.endsWith('.svg')}
                  />
                }
                title={card.title}
                body={card.body}
                ctaLabel={card.ctaLabel}
                href={card.href}
                external={card.external}
                centerOnTablet={index === 2}
              />
            ))}
          </div>
        </ContentStack>
      </SiteShell>
    </SectionBand>
  )
}

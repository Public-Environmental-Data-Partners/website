import {StatCard} from '@/components/cards/stat-card'
import {ContentStack, SectionBand, SiteShell} from '@/components/layout'
import type {ByTheNumbersSectionProps} from '@/lib/mappers/by-the-numbers-section'

/**
 * `byTheNumbersSection` CMS block: kicker + stat cards.
 * Layout: `contained-band` (§01) — stack on small screens, stat row on `md+`.
 */
export function ByTheNumbersSection({kicker, stats}: ByTheNumbersSectionProps) {
  if (stats.length === 0) {
    return null
  }

  return (
    <SectionBand className="bg-background" aria-labelledby="by-the-numbers-heading">
      <SiteShell>
        <ContentStack>
          <h2
            id="by-the-numbers-heading"
            className="section-label-heading text-muted-foreground"
          >
            {kicker}
          </h2>
          <ul className="flex flex-col items-start gap-10 pl-6 pb-6 md:w-full md:flex-row md:items-start md:justify-between md:gap-0 md:pl-0 md:pb-8">
            {stats.map((stat, index) => (
              <li key={`${stat.value}-${stat.label}-${index}`} className="shrink-0 md:first:ml-6">
                <StatCard value={stat.value} label={stat.label} />
              </li>
            ))}
          </ul>
        </ContentStack>
      </SiteShell>
    </SectionBand>
  )
}

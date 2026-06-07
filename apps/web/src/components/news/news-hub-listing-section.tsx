import {SectionBand, SiteShell} from '@/components/layout'
import {cn} from '@/lib/utils'

type NewsHubListingSectionProps = {
  children: React.ReactNode
  className?: string
}

/** Hub listing band below split-hero intro (`contained-band` §01). */
export function NewsHubListingSection({children, className}: NewsHubListingSectionProps) {
  return (
    <SectionBand className={cn('bg-white', className)}>
      <SiteShell padding="hubListing">
        <div data-slot="news-post-teaser-list">{children}</div>
      </SiteShell>
    </SectionBand>
  )
}

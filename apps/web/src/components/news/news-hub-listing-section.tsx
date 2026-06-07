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

/** Visual pagination stub — wired in PR B. */
export function NewsHubPaginationStub({className}: {className?: string}) {
  return (
    <nav
      className={cn('mt-2 flex justify-center gap-2', className)}
      aria-label="Pagination preview"
    >
      <span className="border-navy bg-navy inline-flex min-h-8 min-w-8 items-center justify-center rounded border text-xs font-semibold text-white">
        1
      </span>
      <span className="border-border text-navy inline-flex min-h-8 min-w-8 items-center justify-center rounded border text-xs font-semibold">
        2
      </span>
      <span className="border-border text-navy inline-flex min-h-8 min-w-8 items-center justify-center rounded border text-xs font-semibold">
        3
      </span>
    </nav>
  )
}

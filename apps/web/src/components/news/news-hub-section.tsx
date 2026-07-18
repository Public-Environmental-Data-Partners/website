import {SectionBand, SiteShell} from '@/components/layout'
import type {NewsHubCardProps} from '@/components/news/news-hub-card'
import {NewsHubListingClient} from '@/components/news/news-hub-listing-client'
import type {NewsHubLoadCounts} from '@/lib/queries/news-hub-page'
import {cn} from '@/lib/utils'

type NewsHubSectionProps = {
  title: string
  intro: string
  initialPosts: NewsHubCardProps[]
  total: number
  initialLoad: NewsHubLoadCounts
  loadMore: NewsHubLoadCounts
  className?: string
}

/** News & Updates hub: centered intro + responsive card grid with Load More. */
export function NewsHubSection({
  title,
  intro,
  initialPosts,
  total,
  initialLoad,
  loadMore,
  className,
}: NewsHubSectionProps) {
  return (
    <SectionBand data-slot="news-hub" className={cn('bg-cream', className)} overflowHidden={false}>
      <SiteShell padding="none" className="px-[var(--site-padding-x)]">
        <div data-slot="news-hub-inner">
          <header data-slot="news-hub-intro">
            <h1 data-slot="news-hub-title">{title}</h1>
            <p data-slot="news-hub-lede">{intro}</p>
          </header>

          <NewsHubListingClient
            initialPosts={initialPosts}
            total={total}
            initialLoad={initialLoad}
            loadMore={loadMore}
          />
        </div>
      </SiteShell>
    </SectionBand>
  )
}

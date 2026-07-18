import type {Metadata} from 'next'

import {NewsHubSection} from '@/components/news/news-hub-section'
import {mapNewsPostToHubCardProps} from '@/lib/mappers/news-post'
import {getNewsHubPage, resolveNewsHubLoadConfig} from '@/lib/queries/news-hub-page'
import {getNewsPostsSlice} from '@/lib/queries/news-posts'

export const dynamic = 'force-dynamic'

const DEFAULT_TITLE = 'News & Updates'

export async function generateMetadata(): Promise<Metadata> {
  const hub = await getNewsHubPage()
  const seoTitle = hub?.seo?.title?.trim()
  const description = hub?.seo?.description?.trim()
  const title = seoTitle || hub?.title?.trim() || DEFAULT_TITLE

  return {
    title,
    ...(description ? {description} : {}),
  }
}

export default async function NewsAndUpdatesPage() {
  const hub = await getNewsHubPage()
  const {initialLoad, loadMore} = resolveNewsHubLoadConfig(hub)
  const initialLimit = Math.max(initialLoad.desktop, initialLoad.tablet, initialLoad.mobile)
  const listing = await getNewsPostsSlice(0, initialLimit)

  const cards = listing.posts
    .map((post) => mapNewsPostToHubCardProps(post))
    .filter((props): props is NonNullable<typeof props> => props !== null)

  const title = hub?.title?.trim() || DEFAULT_TITLE
  const intro =
    hub?.intro?.trim() ||
    'Catch up on PEDP’s latest blog posts, reports, happenings, and more on how we are protecting and rebuilding our public environmental data infrastructure and tools.'

  return (
    <NewsHubSection
      title={title}
      intro={intro}
      initialPosts={cards}
      total={listing.total}
      initialLoad={initialLoad}
      loadMore={loadMore}
    />
  )
}

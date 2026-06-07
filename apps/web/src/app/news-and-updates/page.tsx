import type {Metadata} from 'next'

import {NewsHubListingSection} from '@/components/news/news-hub-listing-section'
import {NewsHubPagination} from '@/components/news/news-hub-pagination'
import {NewsPostTeaser} from '@/components/news/news-post-teaser'
import {SplitHeroBleedSection} from '@/components/sections/split-hero-bleed-section'
import {mapNewsPostToTeaserProps} from '@/lib/mappers/news-post'
import {mapSplitHeroBleed} from '@/lib/mappers/split-hero-bleed'
import {getNewsHubPage} from '@/lib/queries/news-hub-page'
import {getNewsPostsPage} from '@/lib/queries/news-posts'

export const dynamic = 'force-dynamic'

const DEFAULT_TITLE = 'News & updates'

type NewsAndUpdatesPageProps = {
  searchParams: Promise<{page?: string}>
}

export async function generateMetadata(): Promise<Metadata> {
  const hub = await getNewsHubPage()
  const seoTitle = hub?.seo?.title?.trim()
  const description = hub?.seo?.description?.trim()

  return {
    title: seoTitle || DEFAULT_TITLE,
    ...(description ? {description} : {}),
  }
}

export default async function NewsAndUpdatesPage({searchParams}: NewsAndUpdatesPageProps) {
  const {page: pageParam} = await searchParams
  const [hub, listing] = await Promise.all([getNewsHubPage(), getNewsPostsPage(pageParam)])
  const heroProps = mapSplitHeroBleed(hub?.hero)

  const teasers = listing.posts
    .map((post) => mapNewsPostToTeaserProps(post))
    .filter((props): props is NonNullable<typeof props> => props !== null)

  return (
    <>
      {heroProps ? <SplitHeroBleedSection {...heroProps} /> : null}
      <NewsHubListingSection>
        {teasers.map((teaser) => (
          <NewsPostTeaser key={teaser.titleId ?? teaser.href} {...teaser} />
        ))}
        <NewsHubPagination currentPage={listing.page} totalPages={listing.totalPages} />
      </NewsHubListingSection>
    </>
  )
}

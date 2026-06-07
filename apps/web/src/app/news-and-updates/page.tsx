import type {Metadata} from 'next'

import {
  NewsHubListingSection,
  NewsHubPaginationStub,
} from '@/components/news/news-hub-listing-section'
import {NewsPostTeaser} from '@/components/news/news-post-teaser'
import {SplitHeroBleedSection} from '@/components/sections/split-hero-bleed-section'
import {NEWS_POST_TEASER_FIXTURES} from '@/lib/fixtures/news-post-teasers'
import {mapSplitHeroBleed} from '@/lib/mappers/split-hero-bleed'
import {getNewsHubPage} from '@/lib/queries/news-hub-page'

export const dynamic = 'force-dynamic'

const DEFAULT_TITLE = 'News & updates'

export async function generateMetadata(): Promise<Metadata> {
  const hub = await getNewsHubPage()
  const seoTitle = hub?.seo?.title?.trim()
  const description = hub?.seo?.description?.trim()

  return {
    title: seoTitle || DEFAULT_TITLE,
    ...(description ? {description} : {}),
  }
}

export default async function NewsAndUpdatesPage() {
  const hub = await getNewsHubPage()
  const heroProps = mapSplitHeroBleed(hub?.hero)

  return (
    <>
      {heroProps ? <SplitHeroBleedSection {...heroProps} /> : null}
      <NewsHubListingSection>
        {NEWS_POST_TEASER_FIXTURES.map((teaser) => (
          <NewsPostTeaser key={teaser.titleId ?? teaser.href} {...teaser} />
        ))}
        <NewsHubPaginationStub />
      </NewsHubListingSection>
    </>
  )
}

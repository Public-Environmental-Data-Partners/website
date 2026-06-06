import type {Metadata} from 'next'

import {SplitHeroBleedSection} from '@/components/sections/split-hero-bleed-section'
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
      {/* Listing stub — Phase 1 cards in news-and-updates-plan.md */}
    </>
  )
}

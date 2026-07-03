import {draftMode} from 'next/headers'
import {cache} from 'react'

import type {SplitHeroBleedFields} from '@/lib/mappers/split-hero-bleed'
import {SANITY_IMAGE_PROJECTION} from '@/lib/queries/sanity-image-projection'
import {sanityFetch} from '@/sanity/live'

const NEWS_HUB_QUERY = `*[_type == "newsHubPage" && _id == "page.newsHub"][0]{
  hero {
    eyebrow,
    title,
    body,
    hideImageOnMobile,
    image ${SANITY_IMAGE_PROJECTION},
    imageMobile ${SANITY_IMAGE_PROJECTION}
  },
  seo {
    title,
    description
  }
}`

export type NewsHubPageData = {
  hero?: SplitHeroBleedFields | null
  seo?: {
    title?: string | null
    description?: string | null
  } | null
} | null

/** Per-request memoization for page + generateMetadata. */
export const getNewsHubPage = cache(async function getNewsHubPage(): Promise<NewsHubPageData> {
  const {isEnabled: isDraftMode} = await draftMode()
  const {data} = await sanityFetch({
    query: NEWS_HUB_QUERY,
    perspective: isDraftMode ? 'drafts' : 'published',
  })
  return data as NewsHubPageData
})

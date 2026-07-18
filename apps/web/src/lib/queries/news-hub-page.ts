import {draftMode} from 'next/headers'
import {cache} from 'react'

import {sanityFetch} from '@/sanity/live'

export type NewsHubLoadCounts = {
  desktop: number
  tablet: number
  mobile: number
}

export type NewsHubPageData = {
  title?: string | null
  intro?: string | null
  initialLoad?: Partial<NewsHubLoadCounts> | null
  loadMore?: Partial<NewsHubLoadCounts> | null
  seo?: {
    title?: string | null
    description?: string | null
  } | null
} | null

export const DEFAULT_INITIAL_LOAD: NewsHubLoadCounts = {
  desktop: 9,
  tablet: 6,
  mobile: 3,
}

export const DEFAULT_LOAD_MORE: NewsHubLoadCounts = {
  desktop: 9,
  tablet: 6,
  mobile: 3,
}

function normalizeLoadCounts(
  value: Partial<NewsHubLoadCounts> | null | undefined,
  fallback: NewsHubLoadCounts,
): NewsHubLoadCounts {
  const clamp = (n: number | undefined, def: number) => {
    if (typeof n !== 'number' || !Number.isFinite(n) || n < 1) {
      return def
    }
    return Math.min(48, Math.floor(n))
  }
  return {
    desktop: clamp(value?.desktop, fallback.desktop),
    tablet: clamp(value?.tablet, fallback.tablet),
    mobile: clamp(value?.mobile, fallback.mobile),
  }
}

export function resolveNewsHubLoadConfig(hub: NewsHubPageData) {
  return {
    initialLoad: normalizeLoadCounts(hub?.initialLoad, DEFAULT_INITIAL_LOAD),
    loadMore: normalizeLoadCounts(hub?.loadMore, DEFAULT_LOAD_MORE),
  }
}

const NEWS_HUB_QUERY = `*[_type == "newsHubPage" && _id == "page.newsHub"][0]{
  title,
  intro,
  initialLoad {
    desktop,
    tablet,
    mobile
  },
  loadMore {
    desktop,
    tablet,
    mobile
  },
  seo {
    title,
    description
  }
}`

/** Per-request memoization for page + generateMetadata. */
export const getNewsHubPage = cache(async function getNewsHubPage(): Promise<NewsHubPageData> {
  const {isEnabled: isDraftMode} = await draftMode()
  const {data} = await sanityFetch({
    query: NEWS_HUB_QUERY,
    perspective: isDraftMode ? 'drafts' : 'published',
  })
  return data as NewsHubPageData
})

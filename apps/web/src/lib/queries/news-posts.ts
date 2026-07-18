import {draftMode} from 'next/headers'
import {cache} from 'react'

import type {NewsPostListItem} from '@/lib/mappers/news-post'
import {SANITY_IMAGE_PROJECTION} from '@/lib/queries/sanity-image-projection'
import {sanityFetch} from '@/sanity/live'

const NEWS_POSTS_SLICE_QUERY = `{
  "posts": *[_type == "newsPost" && defined(publishedAt)] | order(publishedAt desc) [$start...$end]{
    _id,
    title,
    slug,
    publishedAt,
    postType,
    eyebrow,
    image ${SANITY_IMAGE_PROJECTION},
    teaser {
      excerpt,
      tags
    }
  },
  "total": count(*[_type == "newsPost" && defined(publishedAt)])
}`

export type NewsPostsSliceResult = {
  posts: NewsPostListItem[]
  total: number
  offset: number
  limit: number
}

function clampNonNegativeInt(value: number, fallback: number) {
  if (!Number.isFinite(value) || value < 0) {
    return fallback
  }
  return Math.floor(value)
}

function clampPositiveInt(value: number, fallback: number, max = 48) {
  if (!Number.isFinite(value) || value < 1) {
    return fallback
  }
  return Math.min(max, Math.floor(value))
}

/** Fetch a slice of published news posts for the hub listing / Load More API. */
export const getNewsPostsSlice = cache(async function getNewsPostsSlice(
  offset = 0,
  limit = 9,
): Promise<NewsPostsSliceResult> {
  const {isEnabled: isDraftMode} = await draftMode()
  const safeOffset = clampNonNegativeInt(offset, 0)
  const safeLimit = clampPositiveInt(limit, 9)
  const start = safeOffset
  const end = safeOffset + safeLimit

  const {data} = await sanityFetch({
    query: NEWS_POSTS_SLICE_QUERY,
    params: {start, end},
    perspective: isDraftMode ? 'drafts' : 'published',
  })

  const result = data as {posts?: NewsPostListItem[]; total?: number} | null
  return {
    posts: result?.posts ?? [],
    total: result?.total ?? 0,
    offset: safeOffset,
    limit: safeLimit,
  }
})

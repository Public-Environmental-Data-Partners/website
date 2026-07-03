import {draftMode} from 'next/headers'
import {cache} from 'react'

import type {NewsPostListItem} from '@/lib/mappers/news-post'
import {SANITY_IMAGE_PROJECTION} from '@/lib/queries/sanity-image-projection'
import {sanityFetch} from '@/sanity/live'

export const NEWS_POSTS_PAGE_SIZE = 3

const NEWS_POSTS_PAGE_QUERY = `{
  "posts": *[_type == "newsPost" && defined(publishedAt)] | order(publishedAt desc) [$start...$end]{
    _id,
    title,
    slug,
    publishedAt,
    eyebrow,
    image ${SANITY_IMAGE_PROJECTION},
    teaser {
      excerpt,
      tags
    }
  },
  "total": count(*[_type == "newsPost" && defined(publishedAt)])
}`

export type NewsPostsPageResult = {
  posts: NewsPostListItem[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

function parsePageParam(value: string | undefined): number {
  const parsed = Number(value)
  if (!Number.isFinite(parsed) || parsed < 1) {
    return 1
  }
  return Math.floor(parsed)
}

export const getNewsPostsPage = cache(async function getNewsPostsPage(
  pageParam?: string,
): Promise<NewsPostsPageResult> {
  const {isEnabled: isDraftMode} = await draftMode()
  const page = parsePageParam(pageParam)
  const start = (page - 1) * NEWS_POSTS_PAGE_SIZE
  const end = start + NEWS_POSTS_PAGE_SIZE

  const {data} = await sanityFetch({
    query: NEWS_POSTS_PAGE_QUERY,
    params: {start, end},
    perspective: isDraftMode ? 'drafts' : 'published',
  })

  const result = data as {posts?: NewsPostListItem[]; total?: number} | null
  const total = result?.total ?? 0
  const totalPages = total > 0 ? Math.ceil(total / NEWS_POSTS_PAGE_SIZE) : 1
  const safePage = totalPages > 0 ? Math.min(page, totalPages) : 1

  if (safePage !== page && total > 0) {
    const retryStart = (safePage - 1) * NEWS_POSTS_PAGE_SIZE
    const retryEnd = retryStart + NEWS_POSTS_PAGE_SIZE
    const {data: retryData} = await sanityFetch({
      query: NEWS_POSTS_PAGE_QUERY,
      params: {start: retryStart, end: retryEnd},
      perspective: isDraftMode ? 'drafts' : 'published',
    })
    const retryResult = retryData as {posts?: NewsPostListItem[]; total?: number} | null
    return {
      posts: retryResult?.posts ?? [],
      total,
      page: safePage,
      pageSize: NEWS_POSTS_PAGE_SIZE,
      totalPages,
    }
  }

  return {
    posts: result?.posts ?? [],
    total,
    page: safePage,
    pageSize: NEWS_POSTS_PAGE_SIZE,
    totalPages,
  }
})

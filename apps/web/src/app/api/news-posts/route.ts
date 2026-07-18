import {NextResponse} from 'next/server'

import {mapNewsPostToHubCardProps} from '@/lib/mappers/news-post'
import {getNewsPostsSlice} from '@/lib/queries/news-posts'

export const runtime = 'nodejs'

function parseIntParam(value: string | null, fallback: number) {
  if (value == null || value.trim() === '') {
    return fallback
  }
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

/** Public JSON feed for News & Updates Load More. */
export async function GET(request: Request) {
  const {searchParams} = new URL(request.url)
  const offset = parseIntParam(searchParams.get('offset'), 0)
  const limit = parseIntParam(searchParams.get('limit'), 9)

  const slice = await getNewsPostsSlice(offset, limit)
  const posts = slice.posts
    .map((post) => mapNewsPostToHubCardProps(post))
    .filter((props): props is NonNullable<typeof props> => props !== null)

  return NextResponse.json({
    posts,
    total: slice.total,
    offset: slice.offset,
    limit: slice.limit,
  })
}

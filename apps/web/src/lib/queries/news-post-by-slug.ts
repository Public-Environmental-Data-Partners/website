import {draftMode} from 'next/headers'
import {cache} from 'react'

import type {NewsPostDetail} from '@/lib/mappers/news-post'
import {sanityFetch} from '@/sanity/live'

const SANITY_IMAGE_PROJECTION = `{
  alt,
  asset->{
    url,
    metadata{
      dimensions{
        width,
        height
      }
    }
  }
}`

const NEWS_POST_BY_SLUG_QUERY = `*[
  _type == "newsPost" &&
  slug.current == $slug &&
  defined(publishedAt)
][0]{
  _id,
  title,
  slug,
  publishedAt,
  eyebrow,
  author,
  image ${SANITY_IMAGE_PROJECTION},
  teaser {
    excerpt,
    tags
  },
  body
}`

export const getNewsPostBySlug = cache(async function getNewsPostBySlug(
  slug: string,
): Promise<NewsPostDetail | null> {
  const trimmed = slug.trim()
  if (!trimmed) {
    return null
  }

  const {isEnabled: isDraftMode} = await draftMode()
  const {data} = await sanityFetch({
    query: NEWS_POST_BY_SLUG_QUERY,
    params: {slug: trimmed},
    perspective: isDraftMode ? 'drafts' : 'published',
  })

  return (data as NewsPostDetail | null) ?? null
})

import {draftMode} from 'next/headers'
import {cache} from 'react'

import type {NewsPostDetail} from '@/lib/mappers/news-post'
import {SANITY_IMAGE_PROJECTION} from '@/lib/queries/sanity-image-projection'
import {sanityFetch} from '@/sanity/live'

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
  seo {
    title,
    description
  },
  body[]{
    ...,
    _type == "imageBlock" => {
      ...,
      photoCredit,
      source,
      caption[]{...},
      image ${SANITY_IMAGE_PROJECTION}
    }
  }
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

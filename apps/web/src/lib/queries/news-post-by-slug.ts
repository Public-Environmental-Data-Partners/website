import {draftMode} from 'next/headers'
import {cache} from 'react'

import {PT_BLOCKS_GROQ, PT_MARK_DEFS_GROQ} from '@/lib/content-link'
import type {NewsPostDetail} from '@/lib/mappers/news-post'
import {SANITY_IMAGE_PROJECTION} from '@/lib/queries/sanity-image-projection'
import {sanityFetch} from '@/sanity/live'

const NEWS_POST_BY_SLUG_QUERY = `*[
  _type == "newsPost" &&
  postType != "news" &&
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
    excerpt
  },
  seo {
    title,
    description
  },
  audio {
    durationMinutes,
    introSectionHeading,
    file {
      asset-> {
        url
      }
    }
  },
  similarPosts[]->{
    _id,
    title,
    slug,
    publishedAt,
    postType,
    eyebrow,
    image ${SANITY_IMAGE_PROJECTION}
  }[postType != "news"],
  body[]{
    ...,
    ${PT_MARK_DEFS_GROQ},
    _type == "imageBlock" => {
      ...,
      photoCredit,
      caption[]${PT_BLOCKS_GROQ},
      image ${SANITY_IMAGE_PROJECTION}
    },
    _type == "twoImageBlock" => {
      ...,
      items[]{
        ...,
        caption[]${PT_BLOCKS_GROQ},
        image ${SANITY_IMAGE_PROJECTION}
      }
    },
    _type == "imageTextBlock" => {
      ...,
      body[]${PT_BLOCKS_GROQ},
      image ${SANITY_IMAGE_PROJECTION}
    },
    _type == "listBlock" => {
      ...,
      rows[]{
        ...,
        content[]${PT_BLOCKS_GROQ}
      }
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

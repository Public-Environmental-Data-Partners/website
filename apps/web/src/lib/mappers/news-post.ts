import type {NewsPostTeaserProps} from '@/components/news/news-post-teaser'
import type {ArticleHeroSectionProps} from '@/components/sections/article-hero-section'
import {formatPhotoCredit} from '@/lib/format-photo-credit'
import {
  mapSanityArticleHeroImage,
  mapSanityImage,
  type SanityImageData,
} from '@/lib/mappers/sanity-image'

export type NewsPostTeaserFields = {
  excerpt?: string | null
  tags?: (string | null)[] | null
}

export type NewsPostSeoFields = {
  title?: string | null
  description?: string | null
}

export type NewsPostAudioFields = {
  durationMinutes?: number | null
  introSectionHeading?: string | null
  file?: {
    asset?: {
      url?: string | null
    } | null
  } | null
} | null

export type NewsPostListItem = {
  _id: string
  title?: string | null
  slug?: {current?: string | null} | null
  publishedAt?: string | null
  eyebrow?: string | null
  author?: string | null
  image?: SanityImageData
  teaser?: NewsPostTeaserFields | null
  seo?: NewsPostSeoFields | null
}

export type NewsPostDetail = NewsPostListItem & {
  audio?: NewsPostAudioFields
  body?: unknown
}

function normalizeTags(tags: NewsPostTeaserFields['tags']): string[] | undefined {
  if (!Array.isArray(tags)) {
    return undefined
  }
  const values = tags.map((tag) => tag?.trim()).filter((tag): tag is string => Boolean(tag))
  return values.length > 0 ? values : undefined
}

export function mapNewsPostToTeaserProps(
  post: NewsPostListItem | null | undefined,
): NewsPostTeaserProps | null {
  if (!post) {
    return null
  }

  const title = post.title?.trim()
  const slug = post.slug?.current?.trim()
  const publishedAt = post.publishedAt?.trim()
  const excerpt = post.teaser?.excerpt?.trim()

  if (!title || !slug || !publishedAt || !excerpt) {
    return null
  }

  const image = mapSanityImage(post.image ?? null, title)
  if (!image) {
    return null
  }

  return {
    href: `/news-and-updates/${slug}`,
    title,
    excerpt,
    image,
    publishedAt,
    eyebrow: post.eyebrow?.trim() || undefined,
    tags: normalizeTags(post.teaser?.tags),
    titleId: `news-post-${slug}`,
  }
}

function formatArticleHeroDate(iso: string): string | null {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) {
    return null
  }

  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const year = String(date.getFullYear()).slice(-2)
  return `${month}.${day}.${year}`
}

/** v2 article hero — eyebrow → series, publishedAt → MM.DD.YY (docs/blog-components.md). */
export function mapNewsPostToArticleHeroProps(
  post: NewsPostDetail | null | undefined,
): ArticleHeroSectionProps | null {
  if (!post) {
    return null
  }

  const title = post.title?.trim()
  const publishedAt = post.publishedAt?.trim()
  const date = publishedAt ? formatArticleHeroDate(publishedAt) : null
  if (!title || !date) {
    return null
  }

  const image = mapSanityArticleHeroImage(post.image ?? null, title)
  if (!image) {
    return null
  }

  return {
    title,
    date,
    image,
    seriesName: post.eyebrow?.trim() || undefined,
    photoCredit: formatPhotoCredit(post.image?.credit),
  }
}

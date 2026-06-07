import type {NewsPostTeaserProps} from '@/components/news/news-post-teaser'
import type {ArticleDetailHeroSectionProps} from '@/components/sections/article-detail-hero-section'
import {mapSanityImage, type SanityImageData} from '@/lib/mappers/sanity-image'

export type NewsPostTeaserFields = {
  excerpt?: string | null
  tags?: (string | null)[] | null
}

export type NewsPostListItem = {
  _id: string
  title?: string | null
  slug?: {current?: string | null} | null
  publishedAt?: string | null
  eyebrow?: string | null
  author?: string | null
  image?: SanityImageData
  teaser?: NewsPostTeaserFields | null
}

export type NewsPostDetail = NewsPostListItem & {
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

export function mapNewsPostToDetailHeroProps(
  post: NewsPostDetail | null | undefined,
): ArticleDetailHeroSectionProps | null {
  if (!post) {
    return null
  }

  const title = post.title?.trim()
  const publishedAt = post.publishedAt?.trim()
  if (!title || !publishedAt) {
    return null
  }

  const image = mapSanityImage(post.image ?? null, title)
  if (!image) {
    return null
  }

  return {
    title,
    publishedAt,
    image,
    eyebrow: post.eyebrow?.trim() || undefined,
    author: post.author?.trim() || undefined,
  }
}

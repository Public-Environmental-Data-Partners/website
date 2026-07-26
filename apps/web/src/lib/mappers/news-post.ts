import type {NewsHubCardProps} from '@/components/news/news-hub-card'
import type {ArticleHeroSectionProps} from '@/components/sections/article-hero-section'
import type {SimilarPostCardProps} from '@/components/sections/similar-posts-section'
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

export type NewsPostType = 'article' | 'news' | 'blog' | 'story'

export type NewsPostListItem = {
  _id: string
  title?: string | null
  slug?: {current?: string | null} | null
  publishedAt?: string | null
  postType?: string | null
  eyebrow?: string | null
  author?: string | null
  image?: SanityImageData
  teaser?: NewsPostTeaserFields | null
  seo?: NewsPostSeoFields | null
}

export type NewsPostDetail = NewsPostListItem & {
  audio?: NewsPostAudioFields
  body?: unknown
  similarPosts?: (NewsPostListItem | null)[] | null
}

const POST_TYPE_LABELS: Record<NewsPostType, string> = {
  article: 'Article',
  news: 'News',
  blog: 'Blog',
  story: 'Story',
}

export function formatNewsPostTypeLabel(postType: string | null | undefined): string {
  const key = (postType?.trim().toLowerCase() || 'article') as NewsPostType
  return (POST_TYPE_LABELS[key] ?? POST_TYPE_LABELS.article).toUpperCase()
}

/** Hub card props for News & Updates listing. */
export function mapNewsPostToHubCardProps(
  post: NewsPostListItem | null | undefined,
): NewsHubCardProps | null {
  if (!post) {
    return null
  }

  const title = post.title?.trim()
  const slug = post.slug?.current?.trim()
  const excerpt = post.teaser?.excerpt?.trim()

  if (!title || !slug || !excerpt) {
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
    postTypeLabel: formatNewsPostTypeLabel(post.postType),
    titleId: `news-hub-card-${slug}`,
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

/** v2 article hero — eyebrow → series, publishedAt → MM.DD.YY (docs/architecture/article-components.md). */
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

/** Manually ordered related-post references for the article-bottom Similar Posts section. */
export function mapNewsPostToSimilarPosts(
  post: NewsPostDetail | null | undefined,
): SimilarPostCardProps[] {
  if (!Array.isArray(post?.similarPosts)) {
    return []
  }

  return post.similarPosts.flatMap((similarPost) => {
    const title = similarPost?.title?.trim()
    const slug = similarPost?.slug?.current?.trim()
    const publishedAt = similarPost?.publishedAt?.trim()
    const date = publishedAt ? formatArticleHeroDate(publishedAt) : null
    if (!title || !slug || !date) {
      return []
    }

    const image = mapSanityImage(similarPost?.image ?? null, title)
    if (!image) {
      return []
    }

    return [
      {
        href: `/news-and-updates/${slug}`,
        title,
        date,
        image,
        seriesName: similarPost?.eyebrow?.trim() || undefined,
      },
    ]
  })
}

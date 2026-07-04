import type {Metadata} from 'next'

import {siteName, siteUrl} from '@/config/site'
import type {NewsPostDetail} from '@/lib/mappers/news-post'
import {mapSanityShareImage} from '@/lib/mappers/sanity-image'

export const ARTICLE_PATH_PREFIX = '/news-and-updates'

export type NewsPostSeoContent = {
  title: string
  description: string
  canonicalPath: string
  publishedAt: string
  author?: string
  shareImage?: {
    src: string
    alt: string
    width: number
    height: number
  }
}

export function getNewsPostCanonicalPath(slug: string): string {
  return `${ARTICLE_PATH_PREFIX}/${slug}`
}

/** Resolved title, description, and share image with CMS + content fallbacks. */
export function resolveNewsPostSeoContent(
  post: NewsPostDetail | null | undefined,
): NewsPostSeoContent | null {
  if (!post) {
    return null
  }

  const slug = post.slug?.current?.trim()
  const title = post.seo?.title?.trim() || post.title?.trim()
  const description = post.seo?.description?.trim() || post.teaser?.excerpt?.trim()
  const publishedAt = post.publishedAt?.trim()

  if (!slug || !title || !description || !publishedAt) {
    return null
  }

  const shareImage = mapSanityShareImage(post.image ?? null, title)

  return {
    title,
    description,
    canonicalPath: getNewsPostCanonicalPath(slug),
    publishedAt,
    author: post.author?.trim() || undefined,
    shareImage,
  }
}

export function buildNewsPostMetadata(seo: NewsPostSeoContent): Metadata {
  const {title, description, canonicalPath, publishedAt, shareImage} = seo

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      type: 'article',
      title,
      description,
      url: canonicalPath,
      publishedTime: publishedAt,
      ...(shareImage
        ? {
            images: [
              {
                url: shareImage.src,
                width: shareImage.width,
                height: shareImage.height,
                alt: shareImage.alt,
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: shareImage ? 'summary_large_image' : 'summary',
      title,
      description,
      ...(shareImage ? {images: [shareImage.src]} : {}),
    },
  }
}

function formatJsonLdAuthor(name: string): {'@type': 'Person'; name: string} {
  const trimmed = name.trim()
  const normalized = /^by\s+/i.test(trimmed) ? trimmed.replace(/^by\s+/i, '').trim() : trimmed
  return {
    '@type': 'Person',
    name: normalized || trimmed,
  }
}

export function buildNewsPostArticleJsonLd(seo: NewsPostSeoContent): Record<string, unknown> {
  const canonicalUrl = new URL(seo.canonicalPath, siteUrl).href

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: seo.title,
    description: seo.description,
    datePublished: seo.publishedAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
    ...(seo.shareImage ? {image: [seo.shareImage.src]} : {}),
    ...(seo.author ? {author: formatJsonLdAuthor(seo.author)} : {}),
    publisher: {
      '@type': 'Organization',
      name: siteName,
    },
  }
}

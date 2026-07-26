import type {Metadata} from 'next'

import {siteName, siteUrl} from '@/config/site'
import type {NewsPostDetail} from '@/lib/mappers/news-post'
import {mapSanityShareImage} from '@/lib/mappers/sanity-image'
import {
  buildPageMetadata,
  DEFAULT_OG_IMAGE,
  type PageSeoContent,
  resolveSeoTitle,
} from '@/lib/metadata/page-seo'

export const ARTICLE_PATH_PREFIX = '/news-and-updates'

export type NewsPostSeoContent = PageSeoContent & {
  publishedAt: string
  author?: string
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
  const title = resolveSeoTitle(post.seo, post.title ?? '')
  // Articles require an explicit description (SEO override or hub excerpt) — do not
  // fall back to the site default, so incomplete posts stay out of rich share/SEO paths.
  const description = post.seo?.description?.trim() || post.teaser?.excerpt?.trim()
  const publishedAt = post.publishedAt?.trim()

  if (!slug || !title || !description || !publishedAt) {
    return null
  }

  const shareImage = mapSanityShareImage(post.image ?? null, title) ?? DEFAULT_OG_IMAGE

  return {
    title,
    description,
    canonicalPath: getNewsPostCanonicalPath(slug),
    publishedAt,
    author: post.author?.trim() || undefined,
    shareImage,
    openGraphType: 'article',
  }
}

export function buildNewsPostMetadata(seo: NewsPostSeoContent): Metadata {
  return buildPageMetadata({
    title: seo.title,
    description: seo.description,
    canonicalPath: seo.canonicalPath,
    shareImage: seo.shareImage,
    openGraphType: 'article',
    publishedTime: seo.publishedAt,
  })
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
  const imageSrc = seo.shareImage?.src

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
    ...(imageSrc ? {image: [imageSrc.startsWith('http') ? imageSrc : new URL(imageSrc, siteUrl).href]} : {}),
    ...(seo.author ? {author: formatJsonLdAuthor(seo.author)} : {}),
    publisher: {
      '@type': 'Organization',
      name: siteName,
      logo: {
        '@type': 'ImageObject',
        url: new URL('/brand/logo-light.png', siteUrl).href,
      },
    },
  }
}

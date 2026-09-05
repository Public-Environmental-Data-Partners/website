import type {MetadataRoute} from 'next'

import {siteUrl} from '@/config/site'
import {sanityFetch} from '@/sanity/live'

/** Do not statically cache; retired CMS slugs must drop out of the sitemap. */
export const dynamic = 'force-dynamic'

type SitePageSlugRow = {
  slug?: string | null
  _updatedAt?: string | null
}

type NewsPostSlugRow = {
  slug?: string | null
  publishedAt?: string | null
  _updatedAt?: string | null
}

const SITE_PAGE_SLUGS_QUERY = `*[_type == "sitePage" && defined(slug.current) && !(_id in path("drafts.**"))]{
  "slug": slug.current,
  _updatedAt
}`

const NEWS_POST_SLUGS_QUERY = `*[_type == "newsPost" && postType != "news" && defined(slug.current) && defined(publishedAt) && !(_id in path("drafts.**"))] | order(publishedAt desc){
  "slug": slug.current,
  publishedAt,
  _updatedAt
}`

function toLastModified(value: string | null | undefined): Date | undefined {
  if (!value?.trim()) {
    return undefined
  }
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? undefined : date
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [sitePagesResult, newsPostsResult] = await Promise.all([
    sanityFetch({query: SITE_PAGE_SLUGS_QUERY, perspective: 'published'}),
    sanityFetch({query: NEWS_POST_SLUGS_QUERY, perspective: 'published'}),
  ])
  const sitePages = (sitePagesResult.data ?? []) as SitePageSlugRow[]
  const newsPosts = (newsPostsResult.data ?? []) as NewsPostSlugRow[]

  const entries: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${siteUrl}/news-and-updates`,
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ]

  for (const page of sitePages ?? []) {
    const slug = page.slug?.trim()
    if (!slug) {
      continue
    }
    entries.push({
      url: `${siteUrl}/${slug}`,
      lastModified: toLastModified(page._updatedAt),
      changeFrequency: 'monthly',
      priority: 0.7,
    })
  }

  for (const post of newsPosts ?? []) {
    const slug = post.slug?.trim()
    if (!slug) {
      continue
    }
    entries.push({
      url: `${siteUrl}/news-and-updates/${slug}`,
      lastModified: toLastModified(post._updatedAt ?? post.publishedAt),
      changeFrequency: 'monthly',
      priority: 0.6,
    })
  }

  return entries
}

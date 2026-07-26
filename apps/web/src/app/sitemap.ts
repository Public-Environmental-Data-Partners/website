import type {MetadataRoute} from 'next'

import {siteUrl} from '@/config/site'
import {client} from '@/sanity/client'

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

const NEWS_POST_SLUGS_QUERY = `*[_type == "newsPost" && defined(slug.current) && defined(publishedAt) && !(_id in path("drafts.**"))] | order(publishedAt desc){
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
  const [sitePages, newsPosts] = await Promise.all([
    client.fetch<SitePageSlugRow[]>(SITE_PAGE_SLUGS_QUERY),
    client.fetch<NewsPostSlugRow[]>(NEWS_POST_SLUGS_QUERY),
  ])

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

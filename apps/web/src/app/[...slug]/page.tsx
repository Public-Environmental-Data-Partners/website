import type {Metadata} from 'next'

import {sitePageMetadata, SitePageRoute} from '@/components/site-page/site-page-route'
import {sanityFetch} from '@/sanity/live'

/**
 * CMS-backed pages at canonical URLs. Static routes (e.g. `app/donate/page.tsx`)
 * still win when they match the same path. Supports nested slugs such as
 * `/what-we-do/data-preservation` when `sitePage.slug.current` uses that path.
 *
 * A dynamic segment stays server-rendered unless `generateStaticParams` returns
 * an array. `force-static` caches paths that are published after the build.
 */
export const dynamic = 'force-static'

const SITE_PAGE_SLUGS_QUERY = `*[_type == "sitePage" && defined(slug.current) && !(_id in path("drafts.**"))]{
  "slug": slug.current
}`

/** First path segments owned by other `app/` routes. */
const RESERVED_ROOTS = new Set(['api', 'data-catalog', 'dev', 'donate', 'news-and-updates'])

type PageProps = {
  params: Promise<{slug: string[]}>
}

export async function generateStaticParams(): Promise<{slug: string[]}[]> {
  const {data} = await sanityFetch({
    query: SITE_PAGE_SLUGS_QUERY,
    perspective: 'published',
  })
  const rows = (data ?? []) as {slug?: string | null}[]
  const params: {slug: string[]}[] = []
  for (const row of rows) {
    const parts = row.slug
      ?.split('/')
      .map((part) => part.trim())
      .filter(Boolean)
    if (!parts || parts.length === 0 || RESERVED_ROOTS.has(parts[0])) {
      continue
    }
    params.push({slug: parts})
  }
  return params
}

function slugSegmentFromParams(slug: string[]): string {
  return slug.map((s) => decodeURIComponent(s)).join('/')
}

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {slug} = await params
  return sitePageMetadata(slugSegmentFromParams(slug))
}

export default async function SitePage({params}: PageProps) {
  const {slug} = await params
  return <SitePageRoute slugSegment={slugSegmentFromParams(slug)} />
}

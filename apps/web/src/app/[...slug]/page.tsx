import type {Metadata} from 'next'

import {sitePageMetadata, SitePageRoute} from '@/components/site-page/site-page-route'

/**
 * CMS-backed pages at canonical URLs. Static routes (e.g. `app/donate/page.tsx`)
 * still win when they match the same path. Supports nested slugs such as
 * `/what-we-do/data-preservation` when `sitePage.slug.current` uses that path.
 */
export const dynamic = 'force-dynamic'

type PageProps = {
  params: Promise<{slug: string[]}>
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

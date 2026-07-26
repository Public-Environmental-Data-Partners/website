import type {Metadata} from 'next'

import {sitePageMetadata, SitePageRoute} from '@/components/site-page/site-page-route'

/**
 * Static `/donate` route wins over the catch-all. Content comes from the
 * `sitePage` document with slug `donate` (Donate form + info + donor wall).
 */
export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  return sitePageMetadata('donate')
}

export default function DonatePage() {
  return <SitePageRoute slugSegment="donate" />
}

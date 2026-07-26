import {buildSiteJsonLd} from '@/lib/metadata/site-json-ld'

export function SiteJsonLd() {
  const data = buildSiteJsonLd()
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(data)}} />
  )
}

import {defaultOgImagePath, siteDescription, siteName, siteUrl} from '@/config/site'

/** Sitewide Organization + WebSite structured data for the root layout. */
export function buildSiteJsonLd(): Record<string, unknown> {
  const logoUrl = new URL('/brand/logo-light.png', siteUrl).href
  const shareImageUrl = new URL(defaultOgImagePath, siteUrl).href

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        name: siteName,
        url: siteUrl,
        description: siteDescription,
        logo: {
          '@type': 'ImageObject',
          url: logoUrl,
        },
        image: shareImageUrl,
      },
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: siteUrl,
        name: siteName,
        description: siteDescription,
        publisher: {
          '@id': `${siteUrl}/#organization`,
        },
        inLanguage: 'en-US',
      },
    ],
  }
}

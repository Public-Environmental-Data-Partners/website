/** Shared site copy and URLs; used by layout metadata and chrome components. */
export const siteName = 'Public Environmental Data Partners'

export const siteDescription =
  'PEDP is a coalition working to preserve environmental data and tools, strengthen standards, and support communities through advocacy and open infrastructure.'

/**
 * Absolute site origin for canonicals, Open Graph, sitemap, and JSON-LD.
 * Set `NEXT_PUBLIC_SITE_URL` (no trailing slash) on Vercel Production.
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'https://www.publicenvirodata.org'
).replace(/\/$/, '')

/** Default social share card (1200×630) featuring the PEDP logo. */
export const defaultOgImagePath = '/brand/og-default.png'

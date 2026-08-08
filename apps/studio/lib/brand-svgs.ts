/**
 * Brand SVGs under `apps/web/public/brand`.
 * Stored Sanity value is the public path (e.g. `/brand/coalition/data-db.svg`).
 * Keep in sync when adding files under that folder.
 */
export const BRAND_SVGS = [
  {
    title: 'Coalition — Data DB',
    value: '/brand/coalition/data-db.svg',
    group: 'Coalition',
  },
  {
    title: 'Coalition — Members',
    value: '/brand/coalition/members.svg',
    group: 'Coalition',
  },
  {
    title: 'Coalition — Project',
    value: '/brand/coalition/project.svg',
    group: 'Coalition',
  },
  {
    title: 'Donate — Earth',
    value: '/brand/donate/earth.svg',
    group: 'Donate',
  },
  {
    title: 'Donate — Tools',
    value: '/brand/donate/tools.svg',
    group: 'Donate',
  },
  {
    title: 'Newsletter — Envelope',
    value: '/brand/newsletter/envelope.svg',
    group: 'Newsletter',
  },
  {
    title: 'Testimonial — Quote',
    value: '/brand/testimonial/quote.svg',
    group: 'Testimonial',
  },
  {
    title: 'Testimonial — Quote (dark blue)',
    value: '/brand/testimonial/quote-dark-blue.svg',
    group: 'Testimonial',
  },
  {
    title: 'What We Do — Advocacy',
    value: '/brand/what-we-do/advo.svg',
    group: 'What We Do',
  },
  {
    title: 'What We Do — Data Preservation',
    value: '/brand/what-we-do/data-pres.svg',
    group: 'What We Do',
  },
  {
    title: 'What We Do — Tools Development',
    value: '/brand/what-we-do/tools-dev.svg',
    group: 'What We Do',
  },
  {
    title: 'Tools Dev — Discovery',
    value: '/brand/tools-dev/discovery.svg',
    group: 'Tools Dev',
  },
  {
    title: 'Tools Dev — Community',
    value: '/brand/tools-dev/community.svg',
    group: 'Tools Dev',
  },
  {
    title: 'Tools Dev — Monitoring',
    value: '/brand/tools-dev/monitoring.svg',
    group: 'Tools Dev',
  },
  {
    title: 'Tools Dev — Partner',
    value: '/brand/tools-dev/partner.svg',
    group: 'Tools Dev',
  },
  {
    title: 'Tools Dev — Mirroring',
    value: '/brand/tools-dev/mirroring.svg',
    group: 'Tools Dev',
  },
  {
    title: 'Tools Dev — Resources',
    value: '/brand/tools-dev/resources.svg',
    group: 'Tools Dev',
  },
  {
    title: 'Tools Dev — Ideating',
    value: '/brand/tools-dev/ideating.svg',
    group: 'Tools Dev',
  },
] as const

export type BrandSvgPath = (typeof BRAND_SVGS)[number]['value']

export const BRAND_SVG_VALUES = BRAND_SVGS.map((entry) => entry.value)

export function isBrandSvgPath(value: string): value is BrandSvgPath {
  return (BRAND_SVG_VALUES as readonly string[]).includes(value)
}

export function brandSvgTitle(value: string | null | undefined): string | undefined {
  if (!value) {
    return undefined
  }
  return BRAND_SVGS.find((entry) => entry.value === value)?.title
}

/** Origin for Studio `<img>` previews of public brand assets. */
export function brandSvgPreviewOrigin(): string {
  const fromEnv = process.env.SANITY_STUDIO_WEB_ORIGIN?.trim()
  if (fromEnv) {
    return fromEnv.replace(/\/$/, '')
  }
  return 'http://localhost:3000'
}

export function brandSvgPreviewUrl(path: string): string {
  return `${brandSvgPreviewOrigin()}${path.startsWith('/') ? path : `/${path}`}`
}

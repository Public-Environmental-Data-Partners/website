/**
 * Brand SVGs under `apps/web/public/brand`.
 * Values match Studio `brandSvg` stored paths. Keep in sync with
 * `apps/studio/lib/brand-svgs.ts` when adding files.
 */
export const BRAND_SVG_PATHS = [
  '/brand/coalition/data-db.svg',
  '/brand/coalition/members.svg',
  '/brand/coalition/project.svg',
  '/brand/donate/earth.svg',
  '/brand/donate/tools.svg',
  '/brand/newsletter/envelope.svg',
  '/brand/testimonial/quote.svg',
  '/brand/testimonial/quote-dark-blue.svg',
  '/brand/what-we-do/advo.svg',
  '/brand/what-we-do/data-pres.svg',
  '/brand/what-we-do/tools-dev.svg',
  '/brand/tools-dev/discovery.svg',
  '/brand/tools-dev/community.svg',
  '/brand/tools-dev/monitoring.svg',
  '/brand/tools-dev/partner.svg',
  '/brand/tools-dev/mirroring.svg',
  '/brand/tools-dev/resources.svg',
  '/brand/tools-dev/ideating.svg',
  '/brand/data-preservation/legislation.svg',
  '/brand/data-preservation/archives.svg',
] as const

export type BrandSvgPath = (typeof BRAND_SVG_PATHS)[number]

export function isBrandSvgPath(value: string): value is BrandSvgPath {
  return (BRAND_SVG_PATHS as readonly string[]).includes(value)
}

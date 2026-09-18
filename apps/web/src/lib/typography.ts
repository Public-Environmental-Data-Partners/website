/**
 * Shared type-role class strings (Tailwind utilities, not CSS classes).
 * Keeps repeated Figma text styles from drifting between call sites.
 */

/**
 * Reading body copy — Figtree 22px / 1.3 leading.
 * Use for wrapping paragraphs and lists. Keep `leading-none` on labels, nav, and buttons.
 */
export const BODY_LG_CLASS = 'font-sans text-body-lg tracking-normal'

/** Section label / page title role — Figtree Bold 22 / 100% / tracking 0, uppercase. */
export const SECTION_LABEL_HEADING_CLASS =
  'font-sans text-[1.375rem] leading-none font-bold tracking-normal uppercase'

/**
 * Site-page hero heading (Advocacy, Data Preservation, Tools Development) —
 * Source Serif 4 Medium 48 / 55, tracking 0. All breakpoints.
 */
export const SITE_PAGE_HERO_HEADING_CLASS =
  'font-serif text-[3rem] leading-[3.4375rem] font-medium tracking-normal'

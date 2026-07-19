export type ImageShelfBreakpoint = {
  indentPercent: number
  heightPx: number
}

/** Brand palette keys selectable for the image shelf in Studio. */
export const IMAGE_SHELF_BRAND_COLORS = [
  'cream',
  'offWhite',
  'offBlack',
  'lightBeige',
  'beige',
  'darkBeige',
  'lightGreen',
  'pedpGreen',
  'green4',
  'darkGreen',
  'lightBlue',
  'pedpBlue',
  'darkBlue',
] as const

export type ImageShelfBrandColor = (typeof IMAGE_SHELF_BRAND_COLORS)[number]

/** Tailwind background class for each brand shelf color. */
export const IMAGE_SHELF_COLOR_CLASS: Record<ImageShelfBrandColor, string> = {
  cream: 'bg-cream',
  offWhite: 'bg-off-white',
  offBlack: 'bg-off-black',
  lightBeige: 'bg-light-beige',
  beige: 'bg-beige',
  darkBeige: 'bg-dark-beige',
  lightGreen: 'bg-light-green',
  pedpGreen: 'bg-pedp-green',
  green4: 'bg-green-4',
  darkGreen: 'bg-dark-green',
  lightBlue: 'bg-light-blue',
  pedpBlue: 'bg-pedp-blue',
  darkBlue: 'bg-dark-blue',
}

/** Resolved shelf metrics for mobile / tablet / desktop. */
export type ImageShelfSettings = {
  color: ImageShelfBrandColor
  mobile: ImageShelfBreakpoint
  tablet: ImageShelfBreakpoint
  desktop: ImageShelfBreakpoint
}

export const DEFAULT_IMAGE_SHELF_BREAKPOINT: ImageShelfBreakpoint = {
  indentPercent: 25,
  heightPx: 50,
}

export const DEFAULT_IMAGE_SHELF_COLOR: ImageShelfBrandColor = 'offWhite'

export const DEFAULT_IMAGE_SHELF_SETTINGS: ImageShelfSettings = {
  color: DEFAULT_IMAGE_SHELF_COLOR,
  mobile: DEFAULT_IMAGE_SHELF_BREAKPOINT,
  tablet: DEFAULT_IMAGE_SHELF_BREAKPOINT,
  desktop: DEFAULT_IMAGE_SHELF_BREAKPOINT,
}

export type ImageShelfBreakpointFields = {
  indentPercent?: number | null
  heightPx?: number | null
}

export type ImageShelfSettingsFields = {
  color?: string | null
  mobile?: ImageShelfBreakpointFields | null
  tablet?: ImageShelfBreakpointFields | null
  desktop?: ImageShelfBreakpointFields | null
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function isBrandColor(value: string): value is ImageShelfBrandColor {
  return (IMAGE_SHELF_BRAND_COLORS as readonly string[]).includes(value)
}

function mapBreakpoint(data: ImageShelfBreakpointFields | null | undefined): ImageShelfBreakpoint {
  const indent =
    typeof data?.indentPercent === 'number' && Number.isFinite(data.indentPercent)
      ? data.indentPercent
      : DEFAULT_IMAGE_SHELF_BREAKPOINT.indentPercent
  const height =
    typeof data?.heightPx === 'number' && Number.isFinite(data.heightPx)
      ? data.heightPx
      : DEFAULT_IMAGE_SHELF_BREAKPOINT.heightPx

  return {
    indentPercent: clamp(Math.round(indent), 0, 100),
    heightPx: clamp(Math.round(height), 0, 200),
  }
}

function mapColor(value: string | null | undefined): ImageShelfBrandColor {
  if (typeof value === 'string' && isBrandColor(value)) {
    return value
  }
  return DEFAULT_IMAGE_SHELF_COLOR
}

export function mapImageShelfSettings(
  data: ImageShelfSettingsFields | null | undefined,
): ImageShelfSettings {
  if (!data) {
    return DEFAULT_IMAGE_SHELF_SETTINGS
  }

  return {
    color: mapColor(data.color),
    mobile: mapBreakpoint(data.mobile),
    tablet: mapBreakpoint(data.tablet),
    desktop: mapBreakpoint(data.desktop),
  }
}

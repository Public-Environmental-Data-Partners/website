import {
  IMAGE_SHELF_BRAND_COLORS,
  IMAGE_SHELF_COLOR_CLASS,
  type ImageShelfBrandColor,
} from '@/lib/mappers/image-shelf'
import {cn} from '@/lib/utils'

/** Matches Studio `sectionSpacer.heightPx` max. */
const MAX_PX = 600

export type SectionSpacerBackground = 'none' | ImageShelfBrandColor

const BACKGROUND_CLASS: Record<SectionSpacerBackground, string | undefined> = {
  none: undefined,
  ...IMAGE_SHELF_COLOR_CLASS,
}

function isSpacerBackground(value: string): value is SectionSpacerBackground {
  return value === 'none' || (IMAGE_SHELF_BRAND_COLORS as readonly string[]).includes(value)
}

export function SectionSpacer({
  heightPx,
  background = 'none',
}: {
  heightPx: number
  background?: SectionSpacerBackground | string | null
}) {
  const h = Math.min(Math.max(0, Math.round(heightPx)), MAX_PX)
  if (h <= 0) {
    return null
  }

  const fill: SectionSpacerBackground =
    typeof background === 'string' && isSpacerBackground(background) ? background : 'none'

  return (
    <div
      aria-hidden
      className={cn('shrink-0', BACKGROUND_CLASS[fill])}
      style={{height: `${h}px`, minHeight: `${h}px`}}
    />
  )
}

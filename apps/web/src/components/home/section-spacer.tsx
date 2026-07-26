import {cn} from '@/lib/utils'

/** Matches Studio `sectionSpacer.heightPx` max. */
const MAX_PX = 600

export type SectionSpacerBackground = 'none' | 'lightGreen'

const BACKGROUND_CLASS: Record<SectionSpacerBackground, string | undefined> = {
  none: undefined,
  lightGreen: 'bg-light-green',
}

export function SectionSpacer({
  heightPx,
  background = 'none',
}: {
  heightPx: number
  background?: SectionSpacerBackground | null
}) {
  const h = Math.min(Math.max(0, Math.round(heightPx)), MAX_PX)
  if (h <= 0) {
    return null
  }

  const fill: SectionSpacerBackground = background === 'lightGreen' ? 'lightGreen' : 'none'

  return (
    <div
      aria-hidden
      className={cn('shrink-0', BACKGROUND_CLASS[fill])}
      style={{height: `${h}px`, minHeight: `${h}px`}}
    />
  )
}

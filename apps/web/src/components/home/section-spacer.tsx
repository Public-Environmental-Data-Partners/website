/** Matches Studio `sectionSpacer.heightPx` max. */
const MAX_PX = 600

export function SectionSpacer({heightPx}: {heightPx: number}) {
  const h = Math.min(Math.max(0, Math.round(heightPx)), MAX_PX)
  if (h <= 0) {
    return null
  }
  return <div aria-hidden className="shrink-0" style={{height: `${h}px`, minHeight: `${h}px`}} />
}

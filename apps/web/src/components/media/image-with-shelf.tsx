import type {CSSProperties} from 'react'
import {getImageProps} from 'next/image'

import type {HeroImage} from '@/components/hero/hero-image'
import type {ImageShelfSettings} from '@/lib/mappers/image-shelf'
import {DEFAULT_IMAGE_SHELF_SETTINGS, IMAGE_SHELF_COLOR_CLASS} from '@/lib/mappers/image-shelf'
import {cn} from '@/lib/utils'

export type ImageWithShelfProps = {
  image: HeroImage
  shelf?: ImageShelfSettings
  className?: string
  /** Passed to next/image `sizes`. */
  sizes?: string
  fetchPriority?: 'high' | 'low' | 'auto'
}

/**
 * Contained image with a CMS-tunable indented shelf under it (right-flush).
 * Shelf indent/height resolve per breakpoint via CSS variables:
 * mobile &lt;768, tablet 768–1023, desktop ≥1024.
 */
export function ImageWithShelf({
  image,
  shelf = DEFAULT_IMAGE_SHELF_SETTINGS,
  className,
  sizes = '(max-width: 1023px) calc(100vw - 2rem), 40vw',
  fetchPriority,
}: ImageWithShelfProps) {
  const width = typeof image.width === 'number' && image.width > 0 ? image.width : 1200
  const height = typeof image.height === 'number' && image.height > 0 ? image.height : 900
  const {props} = getImageProps({
    src: image.src,
    alt: image.alt,
    width,
    height,
    sizes,
    fetchPriority,
  })

  const shelfVars = {
    '--shelf-indent-m': `${shelf.mobile.indentPercent}%`,
    '--shelf-height-m': `${shelf.mobile.heightPx}px`,
    '--shelf-indent-t': `${shelf.tablet.indentPercent}%`,
    '--shelf-height-t': `${shelf.tablet.heightPx}px`,
    '--shelf-indent-d': `${shelf.desktop.indentPercent}%`,
    '--shelf-height-d': `${shelf.desktop.heightPx}px`,
  } as CSSProperties

  return (
    <div
      data-slot="image-with-shelf"
      className={cn(
        'relative w-full',
        '[--shelf-indent:var(--shelf-indent-m)] [--shelf-height:var(--shelf-height-m)]',
        'md:[--shelf-indent:var(--shelf-indent-t)] md:[--shelf-height:var(--shelf-height-t)]',
        'lg:[--shelf-indent:var(--shelf-indent-d)] lg:[--shelf-height:var(--shelf-height-d)]',
        className,
      )}
      style={shelfVars}
    >
      <div className="relative z-[1] overflow-hidden">
        <img
          {...props}
          alt={image.alt}
          className="h-auto w-full object-cover"
          loading={fetchPriority === 'high' ? 'eager' : undefined}
          decoding="async"
        />
      </div>
      <div
        aria-hidden
        className="pointer-events-none flex w-full"
        style={{height: 'var(--shelf-height)'}}
      >
        <div className="shrink-0" style={{width: 'var(--shelf-indent)'}} />
        <div className={cn('min-w-0 flex-1', IMAGE_SHELF_COLOR_CLASS[shelf.color])} />
      </div>
    </div>
  )
}

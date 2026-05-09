import {PortableText} from '@portabletext/react'
import {getImageProps} from 'next/image'
import Link from 'next/link'

import type {HighlightBannerSectionProps} from '@/lib/mappers/highlight-banner-section'
import {cn} from '@/lib/utils'

export type {HighlightBannerSectionProps}

function imageDimension(value: number | undefined, fallback: number) {
  return typeof value === 'number' && value > 0 ? value : fallback
}

function BannerImageBlock({image}: Pick<HighlightBannerSectionProps, 'image'>) {
  const w = imageDimension(image.width, 1200)
  const h = imageDimension(image.height, 800)
  const {props} = getImageProps({
    src: image.src,
    alt: image.alt,
    width: w,
    height: h,
    sizes: '(max-width: 1023px) 100vw, 42vw',
  })
  return (
    // eslint-disable-next-line @next/next/no-img-element -- getImageProps + native img keeps layout/CSS control in the aspect-ratio wrapper
    <img
      {...props}
      alt={image.alt}
      className="h-full w-full object-cover object-bottom"
      loading="lazy"
      decoding="async"
    />
  )
}

function isExternalHref(href: string) {
  return /^https?:\/\//i.test(href)
}

const HIGHLIGHT_BOTTOM_STRIP_PX = 40

/**
 * Dark green homepage band: image, kicker / heading / body, CTA.
 * Mobile/tablet (<lg): green-4 bar beside image (flush, image height only; see globals CSS).
 * Desktop: full-height viewport gutter strip + grid. Main band stays `bg-forest`.
 * Section spacing vs neighbors: explicit spacer slice in `page.home` sections[] when needed.
 * Bottom edge: 40px-tall strip; `<lg` left 25% `--background` / right 75% `--green-4`; `lg+` 75% / 25%.
 */
export function HighlightBannerSection({
  kicker,
  titleLine,
  heading,
  body,
  ctaLabel,
  ctaHref,
  image,
}: HighlightBannerSectionProps) {
  const headingId = 'highlight-banner-heading'
  const external = isExternalHref(ctaHref)

  const ctaClassName = cn(
    'inline-flex min-h-11 items-center justify-center rounded-[4px] px-6 py-3 text-base font-semibold transition-colors',
    'bg-light-green text-forest hover:bg-light-green/90',
    'focus-visible:ring-light-green focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--forest)] focus-visible:outline-none focus-visible:ring-2',
  )

  return (
    <section
      className="relative overflow-x-hidden bg-forest text-light-green"
      aria-labelledby={headingId}
    >
      <div
        aria-hidden
        className="highlight-banner-green4-gutter pointer-events-none absolute top-0 bottom-0 left-0 z-0 hidden bg-green-4 lg:block"
      />
      <div className="relative z-10 mx-auto w-full max-w-site px-6 pt-20 pb-10 md:px-12 md:pt-28 lg:pb-0">
        <div className="flex flex-col gap-8 lg:grid lg:grid-cols-12 lg:items-stretch lg:gap-10">
          <div className="order-1 lg:order-none lg:col-span-5 lg:flex lg:flex-col lg:justify-end">
            <div className="flex flex-row items-stretch gap-0 lg:block">
              <div
                aria-hidden
                className="highlight-banner-mobile-image-strip shrink-0 bg-green-4 lg:hidden"
              />
              <div className="relative min-w-0 flex-1 overflow-hidden lg:w-full lg:flex-none">
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <BannerImageBlock image={image} />
                </div>
              </div>
            </div>
          </div>

          <div className="order-2 flex min-w-0 flex-col justify-center lg:order-none lg:col-span-7">
            <p className="font-semibold uppercase tracking-wide text-light-green/90">{kicker}</p>
            {titleLine ? (
              <p className="mt-2 text-lg font-medium leading-snug text-light-green md:text-xl">
                {titleLine}
              </p>
            ) : null}
            <h2
              id={headingId}
              className="highlight-banner-title mt-3 font-semibold leading-tight tracking-tight text-light-green md:mt-4"
            >
              {heading}
            </h2>
            <div className="mt-5 max-w-none space-y-4 text-base leading-relaxed text-light-green/95 md:mt-6 md:text-lg">
              <PortableText
                value={body as never}
                components={{
                  marks: {
                    link: ({value, children}) => {
                      const href = typeof value?.href === 'string' ? value.href : '#'
                      const openExternal = /^https?:\/\//i.test(href)
                      return (
                        <a
                          href={href}
                          className="text-light-green underline decoration-light-green/50 underline-offset-[0.2em] transition-colors hover:decoration-light-green"
                          rel={openExternal ? 'noopener noreferrer' : undefined}
                          target={openExternal ? '_blank' : undefined}
                        >
                          {children}
                        </a>
                      )
                    },
                  },
                }}
              />
            </div>
            <div className="mt-6 md:mt-8">
              {external ? (
                <a
                  href={ctaHref}
                  className={ctaClassName}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {ctaLabel}
                </a>
              ) : (
                <Link href={ctaHref} className={ctaClassName}>
                  {ctaLabel}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div
        aria-hidden
        className="relative z-10 flex w-full shrink-0 flex-row"
        style={{height: HIGHLIGHT_BOTTOM_STRIP_PX, minHeight: HIGHLIGHT_BOTTOM_STRIP_PX}}
      >
        <div className="min-w-0 flex-1 bg-background lg:flex-[3]" />
        <div className="min-w-0 flex-[3] bg-green-4 lg:flex-1" />
      </div>
    </section>
  )
}

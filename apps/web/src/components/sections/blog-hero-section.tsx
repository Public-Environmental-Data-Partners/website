import {Grid12, SectionBand, SiteShell} from '@/components/layout'
import {cn} from '@/lib/utils'

export type BlogHeroSectionProps = {
  seriesName: string
  title: string
  date: string
  photoCredit: string
  className?: string
}

/**
 * Blog article detail hero (v2). Step 2: static props, desktop-first layout.
 * @see docs/blog-components.md
 */
export function BlogHeroSection({
  seriesName,
  title,
  date,
  photoCredit,
  className,
}: BlogHeroSectionProps) {
  return (
    <SectionBand className={cn('bg-surface overflow-x-clip', className)} aria-label={title}>
      <div data-slot="blog-hero">
        <SiteShell padding="grid" className="relative z-[1]">
          <div data-slot="blog-hero-text-row">
            <div data-slot="blog-hero-beige-left" aria-hidden="true" />
            <div data-slot="blog-hero-beige-right" aria-hidden="true" />
            <div data-slot="blog-hero-text-panel">
            <Grid12>
              <div className="col-span-8 col-start-3 flex flex-col items-center text-center">
                <div className="flex flex-col items-center gap-8">
                  <p className="text-foreground m-0 text-2xl leading-none font-normal uppercase">
                    {seriesName}
                  </p>
                  <h1 className="text-foreground font-serif m-0 text-[3rem] leading-[55px] font-medium">
                    {title}
                  </h1>
                </div>
                <p className="text-foreground m-0 my-12 text-2xl leading-none font-normal">{date}</p>
              </div>
            </Grid12>
          </div>
          </div>

          <Grid12>
            <figure data-slot="blog-hero-figure" className="col-span-8 col-start-3 m-0">
              <div data-slot="blog-hero-image-placeholder" aria-hidden="true" />
            </figure>
            <figcaption className="text-foreground col-span-8 col-start-3 mt-4 mb-8 text-center text-2xl leading-none font-normal uppercase">
              {photoCredit}
            </figcaption>
          </Grid12>
        </SiteShell>
      </div>
    </SectionBand>
  )
}

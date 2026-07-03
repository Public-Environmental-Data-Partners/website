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
 * Blog article detail hero (v2). Step 3: responsive typography; desktop layout geometry.
 * @see docs/blog-components.md
 */
const heroMainCol = 'col-span-10 col-start-2 lg:col-span-8 lg:col-start-3'

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
                <div className={cn(heroMainCol, 'flex flex-col items-center text-center')}>
                  <div className="flex flex-col items-center gap-8">
                    <p
                      data-slot="blog-hero-series"
                      className="text-foreground m-0 font-normal uppercase"
                    >
                      {seriesName}
                    </p>
                    <h1
                      data-slot="blog-hero-title"
                      className="text-foreground font-serif m-0 font-medium"
                    >
                      {title}
                    </h1>
                  </div>
                  <p data-slot="blog-hero-date" className="text-foreground font-normal">
                    {date}
                  </p>
                </div>
              </Grid12>
            </div>
          </div>

          <Grid12 data-slot="blog-hero-image-grid">
            <figure data-slot="blog-hero-figure" className={cn(heroMainCol, 'm-0')}>
              <div data-slot="blog-hero-image-placeholder" aria-hidden="true" />
            </figure>
            <figcaption
              data-slot="blog-hero-credit"
              className={cn(heroMainCol, 'text-foreground text-center font-normal uppercase')}
            >
              {photoCredit}
            </figcaption>
          </Grid12>
        </SiteShell>
      </div>
    </SectionBand>
  )
}

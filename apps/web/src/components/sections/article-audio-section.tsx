import {ArticleListenPill} from '@/components/content/article-listen-pill'
import {ArticleShareButton} from '@/components/content/article-share-button'
import {Grid12, SectionBand, SiteShell} from '@/components/layout'
import {ARTICLE_COL_7_CENTERED_CLASS, ARTICLE_COL_PROSE_CLASS} from '@/lib/article-body-grid'
import type {ArticleAudioSectionProps} from '@/lib/mappers/article-audio'
import {cn} from '@/lib/utils'

export type ArticleAudioSectionComponentProps = ArticleAudioSectionProps & {
  shareUrl: string
  shareTitle: string
  className?: string
}

/**
 * Optional listen row below the article hero (v2).
 * Heading uses the same prose column as body h2 (@ lg: col 4–9).
 * @see docs/architecture/article-components.md
 */
export function ArticleAudioSection({
  audioSrc,
  durationMinutes,
  introSectionHeading,
  shareUrl,
  shareTitle,
  className,
}: ArticleAudioSectionComponentProps) {
  return (
    <SectionBand
      data-slot="article-audio-section"
      className={cn('bg-surface overflow-x-clip', className)}
      aria-label="Listen to this article"
    >
      <SiteShell className="py-0">
        <Grid12 data-slot="article-audio-grid">
          <h2
            data-slot="article-audio-heading"
            className={cn(
              ARTICLE_COL_PROSE_CLASS,
              'min-w-0 max-lg:order-2 max-lg:text-center lg:row-start-1',
            )}
          >
            {introSectionHeading}
          </h2>
          <div
            className={cn(
              ARTICLE_COL_7_CENTERED_CLASS,
              'max-lg:order-1 max-lg:flex max-lg:justify-center lg:row-start-1 lg:flex lg:items-center lg:justify-end',
            )}
          >
            <div data-slot="article-audio-controls">
              <ArticleListenPill audioSrc={audioSrc} durationMinutes={durationMinutes} />
              <ArticleShareButton shareUrl={shareUrl} shareTitle={shareTitle} />
            </div>
          </div>
        </Grid12>
      </SiteShell>
    </SectionBand>
  )
}

import type {Metadata} from 'next'

import {ArticleListenPill} from '@/components/content/article-listen-pill'
import {ArticleShareButton} from '@/components/content/article-share-button'
import {Grid12, SectionBand, SiteShell} from '@/components/layout'
import {ARTICLE_COL_10_CENTERED_CLASS} from '@/lib/article-body-grid'
import {cn} from '@/lib/utils'

/** Short CC0 sample for layout / play-pause QA (no CMS required). */
const DEV_AUDIO_SRC =
  'https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3'

export const metadata: Metadata = {
  title: 'Article audio dev',
  robots: {index: false, follow: false},
}

const DEV_PROPS = {
  audioSrc: DEV_AUDIO_SRC,
  durationMinutes: 3,
  introSectionHeading: 'Overview',
  shareUrl: 'https://example.com/news-and-updates/sample-article',
  shareTitle: 'Sample article title',
} as const

function ArticleAudioRowPreview() {
  return (
    <div
      data-slot="article-audio-row"
      className={cn(ARTICLE_COL_10_CENTERED_CLASS, 'min-w-0')}
    >
      <h2 data-slot="article-audio-heading">{DEV_PROPS.introSectionHeading}</h2>
      <div data-slot="article-audio-controls">
        <ArticleListenPill
          audioSrc={DEV_PROPS.audioSrc}
          durationMinutes={DEV_PROPS.durationMinutes}
        />
        <ArticleShareButton shareUrl={DEV_PROPS.shareUrl} shareTitle={DEV_PROPS.shareTitle} />
      </div>
    </div>
  )
}

export default function ArticleAudioDevPage() {
  return (
    <SectionBand className="overflow-x-clip bg-white py-12">
      <SiteShell padding="grid">
        <Grid12>
          <div className="col-span-12 mb-8 min-w-0">
            <h1 className="text-foreground m-0 font-serif text-2xl font-medium">
              Article audio intro
            </h1>
            <p className="text-muted-foreground mt-2 max-w-prose text-sm">
              Listen pill + share @ 390 / 768 / 1024+. Desktop: heading left, controls right.
              Below lg: stacked (controls above heading). Play toggles pause icon.
            </p>
          </div>
          <ArticleAudioRowPreview />
        </Grid12>
      </SiteShell>
    </SectionBand>
  )
}

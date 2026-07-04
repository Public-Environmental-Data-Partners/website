import type {Metadata} from 'next'

import {Grid12, SectionBand, SiteShell} from '@/components/layout'
import {ArticleAudioSection} from '@/components/sections/article-audio-section'

/** Short CC0 sample for layout / play-pause QA (no CMS required). */
const DEV_AUDIO_SRC = 'https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3'

export const metadata: Metadata = {
  title: 'Article audio dev',
  robots: {index: false, follow: false},
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
              Listen pill + share @ 390 / 768 / 1024+. Desktop: heading left, controls right. Below
              lg: stacked (controls above heading). Play toggles pause icon.
            </p>
          </div>
        </Grid12>
      </SiteShell>
      <ArticleAudioSection
        audioSrc={DEV_AUDIO_SRC}
        durationMinutes={3}
        introSectionHeading="Overview"
        shareUrl="https://example.com/news-and-updates/sample-article"
        shareTitle="Sample article title"
      />
    </SectionBand>
  )
}

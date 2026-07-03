import type {Metadata} from 'next'

import {Grid12, SectionBand, SiteShell} from '@/components/layout'

export const metadata: Metadata = {
  title: 'Grid12 dev',
  robots: {index: false, follow: false},
}

/** Step 1 layout demo — v2 SiteShell + 12-col grid. Remove when blog hero ships. */
export default function Grid12DevPage() {
  return (
    <SectionBand className="bg-background py-16">
      <SiteShell padding="grid">
        <div className="mb-8 space-y-2 text-center">
          <p className="text-muted-foreground text-sm uppercase tracking-wide">Dev only</p>
          <h1 className="text-2xl font-medium">Grid12 + SiteShell (v2)</h1>
          <p className="text-muted-foreground text-sm">
            1400px grid @ ≥1400 viewport · 16px / 32px inset below · 24px gutter · 8-col span
          </p>
        </div>

        <Grid12 aria-hidden>
          {Array.from({length: 12}, (_, index) => (
            <div
              key={index}
              className="bg-light-beige text-muted-foreground flex h-10 items-center justify-center text-xs font-medium"
            >
              {index + 1}
            </div>
          ))}
        </Grid12>

        <Grid12 className="mt-10">
          <div className="bg-pedp-blue col-span-8 col-start-3 flex min-h-24 items-center justify-center px-4 text-center text-sm font-medium text-white">
            col-span-8 col-start-3 (blog hero text / image target)
          </div>
        </Grid12>
      </SiteShell>
    </SectionBand>
  )
}

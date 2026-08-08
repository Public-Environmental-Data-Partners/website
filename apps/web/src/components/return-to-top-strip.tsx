import {ArrowUp} from 'lucide-react'

import {SiteShell} from '@/components/layout'

/** Global strip above the footer — scrolls to `#top` on the document body. */
export function ReturnToTopStrip() {
  return (
    <div data-slot="return-to-top-strip">
      <SiteShell padding="none" className="px-[var(--site-padding-x)]" data-slot="return-to-top-shell">
        <a href="#top" data-slot="return-to-top-strip-link">
          <ArrowUp aria-hidden />
          <span>Return to top</span>
        </a>
      </SiteShell>
    </div>
  )
}

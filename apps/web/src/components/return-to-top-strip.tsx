import {ArrowUp} from 'lucide-react'

/** Global strip above the footer — scrolls to `#top` on the document body. */
export function ReturnToTopStrip() {
  return (
    <div data-slot="return-to-top-strip">
      <a href="#top" data-slot="return-to-top-strip-link">
        <ArrowUp aria-hidden />
        <span>Return to top</span>
      </a>
    </div>
  )
}

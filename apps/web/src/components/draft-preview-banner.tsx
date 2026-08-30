import {draftMode} from 'next/headers'

/**
 * Renders once from the root layout when draft preview is on so every route shares the same
 * banner (no duplicate markup per page).
 *
 * Use a plain `<a>` for disable-draft: `next/link` client-navigates and skips a full GET, so
 * the draft cookie may not clear; a document navigation runs the route handler correctly.
 */
export async function DraftPreviewBanner() {
  const {isEnabled: isDraftMode} = await draftMode()
  if (!isDraftMode) {
    return null
  }

  return (
    <div
      role="status"
      className="bg-amber-500 px-4 py-2 text-center text-sm font-medium text-amber-950"
    >
      Draft preview, showing unpublished Sanity content.{' '}
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- full navigation so draft cookie clears; Link client-nav breaks disable */}
      <a href="/api/disable-draft" className="underline transition-opacity hover:opacity-80">
        Exit preview
      </a>
    </div>
  )
}

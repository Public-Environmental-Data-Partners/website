import {PortableText} from '@portabletext/react'
import {draftMode} from 'next/headers'

import {sanityFetch} from '@/sanity/live'

/** Draft preview must not use a single build-time snapshot. */
export const dynamic = 'force-dynamic'

const HOME_QUERY = `*[_type == "page" && _id == "page.home"][0]{
  heroKicker,
  heroHeading,
  heroParagraph1,
  heroParagraph2
}`

function DraftPreviewBanner() {
  return (
    <div className="bg-amber-500 px-4 py-2 text-center text-sm font-medium text-amber-950">
      Draft preview — showing unpublished Sanity content.{' '}
      <a href="/api/disable-draft" className="underline">
        Exit preview
      </a>
    </div>
  )
}

export default async function Home() {
  const {isEnabled: isDraftMode} = await draftMode()
  const {data} = await sanityFetch({
    query: HOME_QUERY,
    perspective: isDraftMode ? 'drafts' : 'published',
  })

  if (!data) {
    return (
      <div className="flex flex-1 flex-col font-sans">
        {isDraftMode ? <DraftPreviewBanner /> : null}
        <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-6 py-20 md:px-12">
          <p className="text-muted-foreground">No home page content.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col font-sans">
      {isDraftMode ? <DraftPreviewBanner /> : null}
      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-6 py-20 md:px-12">
        <p className="text-muted-foreground text-sm font-semibold uppercase tracking-wide">
          {data.heroKicker}
        </p>
        <h1 className="text-foreground text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
          {data.heroHeading}
        </h1>
        <div className="text-foreground/90 max-w-none space-y-4 text-lg leading-relaxed">
          <PortableText value={data.heroParagraph1 as never} />
          {data.heroParagraph2 ? <PortableText value={data.heroParagraph2 as never} /> : null}
        </div>
      </div>
    </div>
  )
}

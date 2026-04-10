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
      <div className="flex flex-col flex-1 bg-zinc-50 font-sans dark:bg-black">
        {isDraftMode ? <DraftPreviewBanner /> : null}
        <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-6 py-20 md:px-12">
          <p className="text-zinc-600 dark:text-zinc-400">No home page content.</p>
        </main>
      </div>
    )
  }

  return (
    <div className="flex flex-col flex-1 bg-zinc-50 font-sans dark:bg-black">
      {isDraftMode ? <DraftPreviewBanner /> : null}
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-6 py-20 md:px-12">
        <p className="text-sm font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
          {data.heroKicker}
        </p>
        <h1 className="text-4xl font-semibold leading-tight tracking-tight text-zinc-950 md:text-5xl dark:text-zinc-50">
          {data.heroHeading}
        </h1>
        <div className="max-w-none space-y-4 text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
          <PortableText value={data.heroParagraph1 as never} />
          {data.heroParagraph2 ? <PortableText value={data.heroParagraph2 as never} /> : null}
        </div>
      </main>
    </div>
  )
}

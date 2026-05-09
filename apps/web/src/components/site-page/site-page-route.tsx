import type {PortableTextBlock} from '@portabletext/react'
import type {Metadata} from 'next'
import {draftMode} from 'next/headers'
import {notFound} from 'next/navigation'
import {cache} from 'react'

import {SimpleSectionBlock} from '@/components/site-page/simple-section-block'
import {sanityFetch} from '@/sanity/live'

export const SITE_PAGE_QUERY = `*[_type == "sitePage" && slug.current == $slug][0]{
  title,
  slug,
  sections[]{
    _type,
    _key,
    heading,
    body
  }
}`

export type SimpleSectionGroq = {
  _type: 'simpleSection'
  _key: string
  heading?: string | null
  body?: PortableTextBlock[] | null
}

export type SitePageData = {
  title: string | null
  sections?: SimpleSectionGroq[] | null
}

/**
 * Per-request memoization: `generateMetadata` and `SitePageRoute` share one Sanity fetch
 * (and one `draftMode()` read) for the same `slugSegment`.
 */
export const fetchSitePage = cache(async function fetchSitePage(
  slugSegment: string,
): Promise<{data: SitePageData | null; isDraftMode: boolean}> {
  const {isEnabled: isDraftMode} = await draftMode()
  const {data} = await sanityFetch({
    query: SITE_PAGE_QUERY,
    perspective: isDraftMode ? 'drafts' : 'published',
    params: {slug: slugSegment},
  })
  return {data: data as SitePageData | null, isDraftMode}
})

export async function sitePageMetadata(slugSegment: string): Promise<Metadata> {
  const {data} = await fetchSitePage(slugSegment)

  const title = data?.title?.trim()
  if (!data || !title) {
    notFound()
  }

  return {
    title,
  }
}

function renderSection(section: SimpleSectionGroq) {
  if (section._type === 'simpleSection') {
    if (!section.heading) {
      return null
    }
    return (
      <SimpleSectionBlock
        key={section._key}
        heading={section.heading}
        body={section.body ?? undefined}
      />
    )
  }
  return null
}

export async function SitePageRoute({slugSegment}: {slugSegment: string}) {
  const {data} = await fetchSitePage(slugSegment)

  if (!data) {
    notFound()
  }

  const title = data.title?.trim()
  if (!title) {
    notFound()
  }

  const sections = data.sections ?? []

  return (
    <div className="flex flex-1 flex-col font-sans">
      <div className="mx-auto flex w-full max-w-site flex-1 flex-col gap-12 px-6 py-16 md:px-12 md:py-20">
        <h1 className="text-foreground text-3xl font-semibold tracking-tight md:text-4xl">
          {title}
        </h1>
        <div className="flex flex-col gap-16 md:gap-20">
          {sections.map((section) => renderSection(section))}
        </div>
      </div>
    </div>
  )
}

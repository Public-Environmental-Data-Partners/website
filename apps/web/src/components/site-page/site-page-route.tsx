import type {PortableTextBlock} from '@portabletext/react'
import type {Metadata} from 'next'
import {draftMode} from 'next/headers'
import {notFound} from 'next/navigation'
import {cache} from 'react'

import {ByTheNumbersSection} from '@/components/sections/by-the-numbers-section'
import {TestimonialSection} from '@/components/sections/testimonial-section'
import {SimpleSectionBlock} from '@/components/site-page/simple-section-block'
import {CONTENT_LINK_GROQ, PT_BLOCKS_GROQ} from '@/lib/content-link'
import type {ByTheNumbersSectionFields} from '@/lib/mappers/by-the-numbers-section'
import {mapByTheNumbersSectionToProps} from '@/lib/mappers/by-the-numbers-section'
import type {TestimonialSectionFields} from '@/lib/mappers/testimonial-section'
import {mapTestimonialSectionToProps} from '@/lib/mappers/testimonial-section'
import {sanityFetch} from '@/sanity/live'

export const SITE_PAGE_QUERY = `*[_type == "sitePage" && slug.current == $slug][0]{
  title,
  slug,
  sections[]{
    _type,
    _key,
    heading,
    body[]${PT_BLOCKS_GROQ},
    kicker,
    quote[]${PT_BLOCKS_GROQ},
    attribution,
    ctaLabel,
    ctaLink${CONTENT_LINK_GROQ},
    stats[]{
      _key,
      icon,
      value,
      label,
      body[]${PT_BLOCKS_GROQ},
      ctaLabel,
      ctaLink${CONTENT_LINK_GROQ}
    }
  }
}`

export type SimpleSectionGroq = {
  _type: 'simpleSection'
  _key: string
  heading?: string | null
  body?: PortableTextBlock[] | null
}

type ByTheNumbersSectionGroq = {
  _type: 'byTheNumbersSection'
  _key: string
} & ByTheNumbersSectionFields
type TestimonialSectionGroq = {_type: 'testimonialSection'; _key: string} & TestimonialSectionFields

export type SitePageSectionGroq =
  | SimpleSectionGroq
  | ByTheNumbersSectionGroq
  | TestimonialSectionGroq

export type SitePageData = {
  title: string | null
  sections?: SitePageSectionGroq[] | null
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

function renderSection(section: SitePageSectionGroq) {
  switch (section._type) {
    case 'simpleSection': {
      if (!section.heading) {
        return null
      }
      return (
        <div key={section._key} className="mx-auto w-full max-w-site px-6 md:px-12">
          <SimpleSectionBlock heading={section.heading} body={section.body ?? undefined} />
        </div>
      )
    }
    case 'byTheNumbersSection': {
      const props = mapByTheNumbersSectionToProps(section)
      return props ? <ByTheNumbersSection key={section._key} {...props} /> : null
    }
    case 'testimonialSection': {
      const props = mapTestimonialSectionToProps(section)
      return props ? <TestimonialSection key={section._key} {...props} /> : null
    }
    default:
      return null
  }
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
      <div className="mx-auto w-full max-w-site px-6 pt-16 md:px-12 md:pt-20">
        <h1 className="text-foreground text-3xl font-semibold tracking-tight md:text-4xl">
          {title}
        </h1>
      </div>
      <div className="mt-12 flex flex-col gap-16 pb-16 md:mt-16 md:gap-20 md:pb-20">
        {sections.map((section) => renderSection(section))}
      </div>
    </div>
  )
}

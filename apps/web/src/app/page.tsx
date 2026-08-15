import type {Metadata} from 'next'
import {draftMode} from 'next/headers'
import {cache} from 'react'

import {SiteShell} from '@/components/layout'
import {siteName} from '@/config/site'
import {CONTENT_LINK_GROQ, PT_BLOCKS_GROQ} from '@/lib/content-link'
import {HomeSectionRow, type PageHomeGroqData} from '@/lib/home-sections'
import {buildPageMetadata, resolveSeoDescription} from '@/lib/metadata/page-seo'
import {sanityFetch} from '@/sanity/live'

/** Draft preview must not use a single build-time snapshot. */
export const dynamic = 'force-dynamic'

const HOME_QUERY = `*[_type == "page" && _id == "page.home"][0]{
  seo {
    title,
    description
  },
  sections[]{
    _type,
    _key,
    heroHeading,
    heroParagraph1[]${PT_BLOCKS_GROQ},
    heroParagraph2[]${PT_BLOCKS_GROQ},
    heroParagraph3[]${PT_BLOCKS_GROQ},
    primaryCtaLabel,
    primaryCtaLink${CONTENT_LINK_GROQ},
    secondaryCtaLabel,
    secondaryCtaLink${CONTENT_LINK_GROQ},
    heroImage{
      alt,
      asset->{
        url,
        metadata{
          dimensions{
            width,
            height
          }
        }
      }
    },
    imageShelf{
      color,
      mobile{indentPercent, heightPx},
      tablet{indentPercent, heightPx},
      desktop{indentPercent, heightPx}
    },
    items[]{
      _key,
      icon,
      title,
      body[]${PT_BLOCKS_GROQ},
      ctaLabel,
      ctaLink${CONTENT_LINK_GROQ}
    },
    quote[]${PT_BLOCKS_GROQ},
    attribution,
    surface,
    useMarquee,
    partners[]{
      name,
      url,
      ariaLabel,
      logo{
        alt,
        asset->{
          url,
          metadata{
            dimensions{
              width,
              height
            }
          }
        }
      }
    },
    sectionHeading,
    prompt,
    stats[]{
      _key,
      icon,
      value,
      label,
      body[]${PT_BLOCKS_GROQ},
      ctaLabel,
      ctaLink${CONTENT_LINK_GROQ}
    },
    image{
      alt,
      asset->{
        url,
        metadata{
          dimensions{
            width,
            height
          }
        }
      }
    },
    heading,
    body[]${PT_BLOCKS_GROQ},
    ctaLabel,
    ctaLink${CONTENT_LINK_GROQ},
    cards[]{
      _type,
      _key,
      title,
      eyebrow,
      photoCredit,
      link${CONTENT_LINK_GROQ},
      image{
        alt,
        asset->{
          url,
          metadata{
            dimensions{
              width,
              height
            }
          }
        }
      }
    },
    presentation,
    emailPlaceholder,
    submitLabel,
    heightPx,
    background
  }
}`

const fetchHomePage = cache(async function fetchHomePage(): Promise<PageHomeGroqData | null> {
  const {isEnabled: isDraftMode} = await draftMode()
  const {data} = await sanityFetch({
    query: HOME_QUERY,
    perspective: isDraftMode ? 'drafts' : 'published',
  })
  return data as PageHomeGroqData | null
})

export async function generateMetadata(): Promise<Metadata> {
  const doc = await fetchHomePage()
  const seoTitle = doc?.seo?.title?.trim()
  const metadata = buildPageMetadata({
    title: seoTitle || siteName,
    description: resolveSeoDescription(doc?.seo),
    canonicalPath: '/',
  })

  return {
    ...metadata,
    // Avoid "Site Name | Site Name" from the root title template.
    title: {
      absolute: seoTitle ? `${seoTitle} | ${siteName}` : siteName,
    },
  }
}

export default async function Home() {
  const doc = await fetchHomePage()
  const sections = doc?.sections

  const hasSections = Array.isArray(sections) && sections.length > 0

  if (!doc || !hasSections) {
    return (
      <div className="flex flex-1 flex-col font-sans">
        <SiteShell
          padding="none"
          className="flex flex-1 flex-col gap-6 px-[var(--site-padding-x)] py-20"
        >
          <p className="text-muted-foreground">
            No homepage sections. Add blocks in Sanity (Home → Homepage sections).
          </p>
        </SiteShell>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col font-sans">
      {sections.map((section) => (
        <HomeSectionRow key={section._key} section={section} />
      ))}
    </div>
  )
}

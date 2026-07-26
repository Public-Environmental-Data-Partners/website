import {draftMode} from 'next/headers'

import {CONTENT_LINK_GROQ, PT_BLOCKS_GROQ} from '@/lib/content-link'
import {HomeSectionRow, type PageHomeGroqData} from '@/lib/home-sections'
import {sanityFetch} from '@/sanity/live'

/** Draft preview must not use a single build-time snapshot. */
export const dynamic = 'force-dynamic'

const HOME_QUERY = `*[_type == "page" && _id == "page.home"][0]{
  sections[]{
    _type,
    _key,
    heroHeading,
    heroParagraph1[]${PT_BLOCKS_GROQ},
    heroParagraph2[]${PT_BLOCKS_GROQ},
    heroParagraph3[]${PT_BLOCKS_GROQ},
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
    titleLine,
    heading,
    body[]${PT_BLOCKS_GROQ},
    ctaLabel,
    ctaLink${CONTENT_LINK_GROQ},
    cards[]{
      _type,
      _key,
      title,
      photoCredit,
      authors,
      description,
      chip,
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
    heightPx
  }
}`

export default async function Home() {
  const {isEnabled: isDraftMode} = await draftMode()
  const {data} = await sanityFetch({
    query: HOME_QUERY,
    perspective: isDraftMode ? 'drafts' : 'published',
  })

  const doc = data as PageHomeGroqData | null
  const sections = doc?.sections

  const hasSections = Array.isArray(sections) && sections.length > 0

  if (!doc || !hasSections) {
    return (
      <div className="flex flex-1 flex-col font-sans">
        <div className="mx-auto flex w-full max-w-site flex-1 flex-col gap-6 px-6 py-20 md:px-12">
          <p className="text-muted-foreground">
            No homepage sections. Add blocks in Sanity (Home → Homepage sections).
          </p>
        </div>
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

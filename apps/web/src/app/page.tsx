import {draftMode} from 'next/headers'

import {HomeSectionRow, type PageHomeGroqData} from '@/lib/home-sections'
import {sanityFetch} from '@/sanity/live'

/** Draft preview must not use a single build-time snapshot. */
export const dynamic = 'force-dynamic'

const HOME_QUERY = `*[_type == "page" && _id == "page.home"][0]{
  sections[]{
    _type,
    _key,
    heroHeading,
    heroParagraph1,
    heroParagraph2,
    heroParagraph3,
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
      body,
      ctaLabel,
      ctaPage->{
        slug
      }
    },
    quote,
    attribution,
    ctaPage->{
      slug
    },
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
    kicker,
    stats[]{
      _key,
      icon,
      value,
      label,
      body,
      ctaLabel,
      ctaLinkType,
      ctaPage->{
        slug
      },
      ctaExternalUrl
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
    body,
    ctaLabel,
    ctaLink{
      path,
      externalUrl,
      sitePage->{
        slug
      }
    },
    sectionHeading,
    cards[]{
      _type,
      _key,
      title,
      authors,
      description,
      chip,
      link{
        path,
        externalUrl,
        sitePage->{
          slug
        }
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
      }
    },
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

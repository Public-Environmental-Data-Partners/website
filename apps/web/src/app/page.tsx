import {draftMode} from 'next/headers'

import {CoalitionSection} from '@/components/home/coalition-section'
import {HeroSection} from '@/components/home/hero-section'
import {mapCoalitionBlockToProps} from '@/lib/mappers/coalition-block'
import {mapHeroBlockToProps} from '@/lib/mappers/hero-block'
import {sanityFetch} from '@/sanity/live'

/** Draft preview must not use a single build-time snapshot. */
export const dynamic = 'force-dynamic'

const HOME_QUERY = `*[_type == "page" && _id == "page.home"][0]{
  heroKicker,
  heroHeading,
  heroParagraph1,
  heroParagraph2,
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
  heroImageMobile{
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
  hideHeroImageOnMobile,
  coalitionHeading,
  coalitionPartners[]{
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
  }
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

  const heroProps = mapHeroBlockToProps(data)
  const coalitionProps = mapCoalitionBlockToProps(data)

  return (
    <div className="flex flex-1 flex-col font-sans">
      {isDraftMode ? <DraftPreviewBanner /> : null}
      {heroProps ? (
        <HeroSection {...heroProps} />
      ) : (
        <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-6 py-20 md:px-12">
          <p className="text-muted-foreground">Home page hero is missing a heading.</p>
        </div>
      )}
      {coalitionProps ? <CoalitionSection {...coalitionProps} /> : null}
    </div>
  )
}

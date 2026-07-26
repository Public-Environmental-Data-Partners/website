import type {PortableTextBlock} from '@portabletext/react'
import type {Metadata} from 'next'
import {draftMode} from 'next/headers'
import {notFound} from 'next/navigation'
import {cache} from 'react'

import {DonateMainBand} from '@/components/donate/donate-main-band'
import {DonorWallSection} from '@/components/donate/donor-wall-section'
import {NewsletterSection} from '@/components/home/newsletter-section'
import {SectionSpacer} from '@/components/home/section-spacer'
import {Grid12, SiteShell} from '@/components/layout'
import {ByTheNumbersSection} from '@/components/sections/by-the-numbers-section'
import {PartnerLogosSection} from '@/components/sections/partner-logos-section'
import {TestimonialSection} from '@/components/sections/testimonial-section'
import {AboutIntroSection} from '@/components/site-page/about-intro-section'
import {ContactHeroSection} from '@/components/site-page/contact-hero-section'
import {type ContactCtaBlock, ContactSection} from '@/components/site-page/contact-section'
import {LegalDocumentSection} from '@/components/site-page/legal-document-section'
import {SimpleSectionBlock} from '@/components/site-page/simple-section-block'
import {ARTICLE_COL_PROSE_CLASS} from '@/lib/article-body-grid'
import {CONTENT_LINK_GROQ, PT_BLOCKS_GROQ, PT_MARK_DEFS_GROQ} from '@/lib/content-link'
import type {ByTheNumbersSectionFields} from '@/lib/mappers/by-the-numbers-section'
import {mapByTheNumbersSectionToProps} from '@/lib/mappers/by-the-numbers-section'
import type {
  DonateFormSectionFields,
  DonateInfoSectionFields,
  DonorWallSectionFields,
} from '@/lib/mappers/donate-sections'
import {
  mapDonateFormSectionToProps,
  mapDonateInfoSectionToProps,
  mapDonorWallSectionToProps,
} from '@/lib/mappers/donate-sections'
import type {NewsletterSectionFields} from '@/lib/mappers/newsletter-section'
import {mapNewsletterSectionToProps} from '@/lib/mappers/newsletter-section'
import type {PartnerLogosSectionFields} from '@/lib/mappers/partner-logos-section'
import {mapPartnerLogosSectionToProps} from '@/lib/mappers/partner-logos-section'
import {mapSanityImage, type SanityImageData} from '@/lib/mappers/sanity-image'
import type {TestimonialSectionFields} from '@/lib/mappers/testimonial-section'
import {mapTestimonialSectionToProps} from '@/lib/mappers/testimonial-section'
import {SANITY_IMAGE_PROJECTION} from '@/lib/queries/sanity-image-projection'
import {cn} from '@/lib/utils'
import {sanityFetch} from '@/sanity/live'

const SITE_PAGE_BODY_GROQ = `{
  ...,
  ${PT_MARK_DEFS_GROQ},
  _type == "contactCta" => {
    label,
    link${CONTENT_LINK_GROQ}
  }
}`

export const SITE_PAGE_QUERY = `*[_type == "sitePage" && slug.current == $slug][0]{
  title,
  slug,
  sections[]{
    _type,
    _key,
    heading,
    lastUpdated,
    body[]${SITE_PAGE_BODY_GROQ},
    image${SANITY_IMAGE_PROJECTION},
    presentation,
    emailPlaceholder,
    submitLabel,
    sectionHeading,
    prompt,
    donorboxCampaign,
    rows[]{
      label,
      icon${SANITY_IMAGE_PROJECTION}
    },
    quote[]${PT_BLOCKS_GROQ},
    attribution,
    ctaLabel,
    ctaLink${CONTENT_LINK_GROQ},
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
    heightPx,
    background,
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

export type LegalDocumentSectionGroq = {
  _type: 'legalDocumentSection'
  _key: string
  lastUpdated?: string | null
  body?: PortableTextBlock[] | null
}

export type AboutIntroGroq = {
  _type: 'aboutIntro'
  _key: string
  body?: PortableTextBlock[] | null
  image?: SanityImageData
}

export type ContactHeroGroq = {
  _type: 'contactHero'
  _key: string
  image?: SanityImageData
}

export type ContactSectionGroq = {
  _type: 'contactSection'
  _key: string
  sectionHeading?: string | null
  body?: Array<PortableTextBlock | ContactCtaBlock> | null
}

type DonateFormSectionGroq = {
  _type: 'donateFormSection'
  _key: string
} & DonateFormSectionFields

type DonateInfoSectionGroq = {
  _type: 'donateInfoSection'
  _key: string
} & DonateInfoSectionFields

type DonorWallSectionGroq = {
  _type: 'donorWallSection'
  _key: string
} & DonorWallSectionFields

export type NewsletterSectionGroq = {
  _type: 'newsletterSection'
  _key: string
} & NewsletterSectionFields

type ByTheNumbersSectionGroq = {
  _type: 'byTheNumbersSection'
  _key: string
} & ByTheNumbersSectionFields
type TestimonialSectionGroq = {_type: 'testimonialSection'; _key: string} & TestimonialSectionFields

type PartnerLogosSectionGroq = {
  _type: 'partnerLogosSection'
  _key: string
} & PartnerLogosSectionFields

type SectionSpacerGroq = {
  _type: 'sectionSpacer'
  _key: string
  heightPx?: number | null
  background?: 'none' | 'lightGreen' | null
}

export type SitePageSectionGroq =
  | SimpleSectionGroq
  | LegalDocumentSectionGroq
  | AboutIntroGroq
  | ContactHeroGroq
  | ContactSectionGroq
  | DonateFormSectionGroq
  | DonateInfoSectionGroq
  | DonorWallSectionGroq
  | NewsletterSectionGroq
  | ByTheNumbersSectionGroq
  | TestimonialSectionGroq
  | PartnerLogosSectionGroq
  | SectionSpacerGroq

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

/** Format Sanity `date` (YYYY-MM-DD) as "March 17, 2025" in local calendar terms. */
export function formatSitePageLastUpdated(dateStr: string): string | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr.trim())
  if (!match) {
    return null
  }
  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const date = new Date(year, month - 1, day)
  if (Number.isNaN(date.getTime())) {
    return null
  }
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

function getLegalDocumentSection(sections: SitePageSectionGroq[]): LegalDocumentSectionGroq | null {
  if (sections.length !== 1) {
    return null
  }
  const [only] = sections
  return only?._type === 'legalDocumentSection' ? only : null
}

function renderMarketingSection(section: SitePageSectionGroq) {
  switch (section._type) {
    case 'simpleSection': {
      const heading = section.heading?.trim()
      if (!heading) {
        return null
      }
      return (
        <SiteShell key={section._key} padding="none" className="px-[var(--site-padding-x)]">
          <SimpleSectionBlock heading={heading} body={section.body ?? undefined} />
        </SiteShell>
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
    case 'newsletterSection': {
      const props = mapNewsletterSectionToProps(section)
      return props ? <NewsletterSection key={section._key} {...props} /> : null
    }
    case 'contactSection': {
      const sectionHeading = section.sectionHeading?.trim()
      const body = section.body ?? []
      return sectionHeading && body.length > 0 ? (
        <ContactSection key={section._key} sectionHeading={sectionHeading} body={body} />
      ) : null
    }
    case 'partnerLogosSection': {
      const props = mapPartnerLogosSectionToProps(section)
      return props ? (
        <PartnerLogosSection
          key={section._key}
          {...props}
          headingId={`partner-logos-${section._key}`}
        />
      ) : null
    }
    case 'sectionSpacer':
      return typeof section.heightPx === 'number' ? (
        <SectionSpacer
          key={section._key}
          heightPx={section.heightPx}
          background={section.background}
        />
      ) : null
    case 'aboutIntro':
    case 'contactHero':
    case 'donateFormSection':
    case 'donateInfoSection':
    case 'donorWallSection':
      // About / Contact / Donate pages are handled as composed pages below.
      return null
    case 'legalDocumentSection':
      // Schema validation keeps this as the sole section; defensive no-op if mixed.
      return null
    default:
      return null
  }
}

function renderAboutPageSection(section: SitePageSectionGroq, pageTitle: string) {
  switch (section._type) {
    case 'aboutIntro': {
      const image = mapSanityImage(section.image ?? null, '')
      const body = section.body ?? []
      return image && body.length > 0 ? (
        <AboutIntroSection key={section._key} title={pageTitle} body={body} image={image} />
      ) : null
    }
    default:
      return renderMarketingSection(section)
  }
}

function renderContactPageSection(section: SitePageSectionGroq, pageTitle: string) {
  switch (section._type) {
    case 'contactHero': {
      const image = mapSanityImage(section.image ?? null, '')
      return image ? (
        <ContactHeroSection key={section._key} title={pageTitle} image={image} />
      ) : null
    }
    case 'contactSection': {
      const sectionHeading = section.sectionHeading?.trim()
      const body = section.body ?? []
      return sectionHeading && body.length > 0 ? (
        <ContactSection key={section._key} sectionHeading={sectionHeading} body={body} />
      ) : null
    }
    case 'newsletterSection': {
      const props = mapNewsletterSectionToProps(section)
      return props ? <NewsletterSection key={section._key} {...props} /> : null
    }
    default:
      return renderMarketingSection(section)
  }
}

function renderDonatePage(sections: SitePageSectionGroq[], pageTitle: string) {
  let form: ReturnType<typeof mapDonateFormSectionToProps> = null
  let info: ReturnType<typeof mapDonateInfoSectionToProps> = null
  let wall: ReturnType<typeof mapDonorWallSectionToProps> = null
  const trailing: SitePageSectionGroq[] = []

  for (const section of sections) {
    switch (section._type) {
      case 'donateFormSection':
        form = mapDonateFormSectionToProps(section)
        break
      case 'donateInfoSection':
        info = mapDonateInfoSectionToProps(section)
        break
      case 'donorWallSection':
        wall = mapDonorWallSectionToProps(section)
        break
      default:
        trailing.push(section)
    }
  }

  return (
    <div className="flex flex-1 flex-col bg-cream font-sans">
      <DonateMainBand pageTitle={pageTitle} form={form} info={info} />
      {wall ? <DonorWallSection {...wall} /> : null}
      {trailing.map((section) => renderMarketingSection(section))}
    </div>
  )
}

function LegalDocumentHeader({title, lastUpdated}: {title: string; lastUpdated?: string | null}) {
  const lastUpdatedLabel = lastUpdated ? formatSitePageLastUpdated(lastUpdated) : null

  return (
    <header className="min-w-0 text-center">
      <h1 className="text-foreground font-sans text-[1.375rem] leading-none font-bold tracking-normal uppercase">
        {title}
      </h1>
      {lastUpdatedLabel ? (
        <p className="text-foreground mt-4 text-sm font-semibold tracking-wide uppercase md:text-base">
          Last updated:{' '}
          <time dateTime={lastUpdated ?? undefined} className="font-normal normal-case italic">
            {lastUpdatedLabel}
          </time>
        </p>
      ) : null}
    </header>
  )
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
  const legalSection = getLegalDocumentSection(sections)

  if (legalSection) {
    return (
      <div className="flex flex-1 flex-col font-sans">
        <SiteShell padding="grid" className="pt-16 pb-16 md:pt-20 md:pb-20">
          <Grid12 className="gap-y-12 md:gap-y-16">
            <div className={cn(ARTICLE_COL_PROSE_CLASS, 'min-w-0')}>
              <LegalDocumentHeader title={title} lastUpdated={legalSection.lastUpdated} />
            </div>
            <div className={cn(ARTICLE_COL_PROSE_CLASS, 'min-w-0 text-left')}>
              <LegalDocumentSection body={legalSection.body ?? undefined} />
            </div>
          </Grid12>
        </SiteShell>
      </div>
    )
  }

  const isAboutPage = sections[0]?._type === 'aboutIntro'
  if (isAboutPage) {
    return (
      <div className="flex flex-1 flex-col bg-cream font-sans">
        {sections.map((section) => renderAboutPageSection(section, title))}
      </div>
    )
  }

  const isContactPage = sections[0]?._type === 'contactHero'
  if (isContactPage) {
    return (
      <div className="flex flex-1 flex-col bg-cream font-sans">
        {sections.map((section) => renderContactPageSection(section, title))}
      </div>
    )
  }

  const isDonatePage = sections[0]?._type === 'donateFormSection'
  if (isDonatePage) {
    return renderDonatePage(sections, title)
  }

  return (
    <div className="flex flex-1 flex-col font-sans">
      <SiteShell padding="none" className="px-[var(--site-padding-x)] pt-16 md:pt-20">
        <h1 className="text-foreground text-3xl font-semibold tracking-tight md:text-4xl">
          {title}
        </h1>
      </SiteShell>
      <div className="mt-12 flex flex-col gap-16 pb-16 md:mt-16 md:gap-20 md:pb-20">
        {sections.map((section) => renderMarketingSection(section))}
      </div>
    </div>
  )
}

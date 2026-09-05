import type {PortableTextBlock} from '@portabletext/react'
import type {Metadata} from 'next'
import {draftMode} from 'next/headers'
import {notFound} from 'next/navigation'
import {cache} from 'react'

import {DonateMainBand} from '@/components/donate/donate-main-band'
import {DonorWallSection} from '@/components/donate/donor-wall-section'
import {NewsletterSection} from '@/components/home/newsletter-section'
import {SectionSpacer} from '@/components/home/section-spacer'
import {Grid12, SectionBand, SiteShell} from '@/components/layout'
import {AdvocacyHeroSection} from '@/components/sections/advocacy-hero-section'
import {ByTheNumbersSection} from '@/components/sections/by-the-numbers-section'
import {CardCarouselSection} from '@/components/sections/card-carousel-section'
import {DataGuideBodySection} from '@/components/sections/data-guide-body-section'
import {DataGuideHeroSection} from '@/components/sections/data-guide-hero-section'
import {DataPreservationHeroSection} from '@/components/sections/data-preservation-hero-section'
import {FocusOnAccessSection} from '@/components/sections/focus-on-access-section'
import {MetadataStandardsSection} from '@/components/sections/metadata-standards-section'
import {PartnerLogosSection} from '@/components/sections/partner-logos-section'
import {RiskNominateSection} from '@/components/sections/risk-nominate-section'
import {SimpleSection} from '@/components/sections/simple-section'
import {TestimonialSection} from '@/components/sections/testimonial-section'
import {TextImageSection} from '@/components/sections/text-image-section'
import {ToolCategorySection} from '@/components/sections/tool-category-section'
import {ToolsDevelopmentHero} from '@/components/sections/tools-development-hero'
import {AboutIntroSection} from '@/components/site-page/about-intro-section'
import {ContactHeroSection} from '@/components/site-page/contact-hero-section'
import {type ContactCtaBlock, ContactSection} from '@/components/site-page/contact-section'
import {GetInvolvedIntroSection} from '@/components/site-page/get-involved-intro-section'
import {LegalDocumentSection} from '@/components/site-page/legal-document-section'
import {OtherWaysSection} from '@/components/site-page/other-ways-section'
import {ARTICLE_COL_PROSE_CLASS} from '@/lib/article-body-grid'
import {CONTENT_LINK_GROQ, PT_BLOCKS_GROQ, PT_MARK_DEFS_GROQ} from '@/lib/content-link'
import type {AdvocacyHeroFields} from '@/lib/mappers/advocacy-sections'
import {mapAdvocacyHeroToProps} from '@/lib/mappers/advocacy-sections'
import type {ByTheNumbersSectionFields} from '@/lib/mappers/by-the-numbers-section'
import {mapByTheNumbersSectionToProps} from '@/lib/mappers/by-the-numbers-section'
import type {CardCarouselSectionFields} from '@/lib/mappers/card-carousel-section'
import {mapCardCarouselSectionToProps} from '@/lib/mappers/card-carousel-section'
import type {DataGuideBodyFields, DataGuideHeroFields} from '@/lib/mappers/data-guide-sections'
import {mapDataGuideBodyToProps, mapDataGuideHeroToProps} from '@/lib/mappers/data-guide-sections'
import type {
  DataPreservationHeroFields,
  FocusOnAccessSectionFields,
  MetadataStandardsSectionFields,
  RiskNominateSectionFields,
} from '@/lib/mappers/data-preservation-sections'
import {
  mapDataPreservationHeroToProps,
  mapFocusOnAccessSectionToProps,
  mapMetadataStandardsSectionToProps,
  mapRiskNominateSectionToProps,
} from '@/lib/mappers/data-preservation-sections'
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
import type {
  GetInvolvedIntroFields,
  OtherWaysSectionFields,
} from '@/lib/mappers/get-involved-sections'
import {
  mapGetInvolvedIntroToProps,
  mapOtherWaysSectionToProps,
} from '@/lib/mappers/get-involved-sections'
import type {NewsletterSectionFields} from '@/lib/mappers/newsletter-section'
import {mapNewsletterSectionToProps} from '@/lib/mappers/newsletter-section'
import type {PartnerLogosSectionFields} from '@/lib/mappers/partner-logos-section'
import {mapPartnerLogosSectionToProps} from '@/lib/mappers/partner-logos-section'
import {mapSanityImage, type SanityImageData} from '@/lib/mappers/sanity-image'
import type {SimpleSectionFields} from '@/lib/mappers/simple-section'
import {mapSimpleSectionToProps} from '@/lib/mappers/simple-section'
import type {TestimonialSectionFields} from '@/lib/mappers/testimonial-section'
import {mapTestimonialSectionToProps} from '@/lib/mappers/testimonial-section'
import type {TextImageSectionFields} from '@/lib/mappers/text-image-section'
import {mapTextImageSectionToProps} from '@/lib/mappers/text-image-section'
import type {
  ToolCategorySectionFields,
  ToolsDevelopmentHeroFields,
} from '@/lib/mappers/tools-development'
import {
  mapToolCategorySectionToProps,
  mapToolsDevelopmentHeroToProps,
} from '@/lib/mappers/tools-development'
import {buildPageMetadata, resolveSeoDescription, resolveSeoTitle} from '@/lib/metadata/page-seo'
import {SANITY_IMAGE_PROJECTION} from '@/lib/queries/sanity-image-projection'
import {SECTION_LABEL_HEADING_CLASS} from '@/lib/typography'
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
  seo {
    title,
    description
  },
  sections[]{
    _type,
    _key,
    heading,
    eyebrow,
    lastUpdated,
    body[]${SITE_PAGE_BODY_GROQ},
    callout[]${SITE_PAGE_BODY_GROQ},
    image${SANITY_IMAGE_PROJECTION},
    fileListImage${SANITY_IMAGE_PROJECTION},
    collageImage${SANITY_IMAGE_PROJECTION},
    imageShelf,
    imagePosition,
    surface,
    presentation,
    emailPlaceholder,
    submitLabel,
    sectionHeading,
    prompt,
    focusAreasHeading,
    focusAreas[]{
      _key,
      icon,
      title
    },
    guidePrompt,
    guideCtaLabel,
    guideCtaLink${CONTENT_LINK_GROQ},
    donorboxCampaign,
    cardHeading,
    cardBody[]${PT_BLOCKS_GROQ},
    showCta,
    rows[]{
      label,
      icon${SANITY_IMAGE_PROJECTION}
    },
    cards[]{
      _type,
      _key,
      title,
      eyebrow,
      photoCredit,
      description,
      version,
      pill,
      body[]${PT_BLOCKS_GROQ},
      ctaLabel,
      ctaLink${CONTENT_LINK_GROQ},
      link${CONTENT_LINK_GROQ},
      icon${SANITY_IMAGE_PROJECTION},
      image${SANITY_IMAGE_PROJECTION}
    },
    items[]{
      _key,
      icon,
      heading,
      body[]${PT_BLOCKS_GROQ}
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
} & SimpleSectionFields

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

export type TextImageSectionGroq = {
  _type: 'textImageSection'
  _key: string
} & TextImageSectionFields

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

type ToolsDevelopmentHeroGroq = {
  _type: 'toolsDevelopmentHero'
  _key: string
} & ToolsDevelopmentHeroFields

type ToolCategorySectionGroq = {
  _type: 'toolCategorySection'
  _key: string
} & ToolCategorySectionFields

type PartnerLogosSectionGroq = {
  _type: 'partnerLogosSection'
  _key: string
} & PartnerLogosSectionFields

type GetInvolvedIntroGroq = {
  _type: 'getInvolvedIntro'
  _key: string
} & GetInvolvedIntroFields

type OtherWaysSectionGroq = {
  _type: 'otherWaysSection'
  _key: string
} & OtherWaysSectionFields

type DataGuideHeroGroq = {
  _type: 'dataGuideHero'
  _key: string
} & DataGuideHeroFields

type DataGuideBodyGroq = {
  _type: 'dataGuideBody'
  _key: string
} & DataGuideBodyFields

type AdvocacyHeroGroq = {
  _type: 'advocacyHero'
  _key: string
} & AdvocacyHeroFields

type DataPreservationHeroGroq = {
  _type: 'dataPreservationHero'
  _key: string
} & DataPreservationHeroFields

type FocusOnAccessSectionGroq = {
  _type: 'focusOnAccessSection'
  _key: string
} & FocusOnAccessSectionFields

type RiskNominateSectionGroq = {
  _type: 'riskNominateSection'
  _key: string
} & RiskNominateSectionFields

type MetadataStandardsSectionGroq = {
  _type: 'metadataStandardsSection'
  _key: string
} & MetadataStandardsSectionFields

type CardCarouselSectionGroq = {
  _type: 'cardCarouselSection'
  _key: string
} & CardCarouselSectionFields

type SectionSpacerGroq = {
  _type: 'sectionSpacer'
  _key: string
  heightPx?: number | null
  background?: string | null
}

export type SitePageSectionGroq =
  | SimpleSectionGroq
  | LegalDocumentSectionGroq
  | AboutIntroGroq
  | TextImageSectionGroq
  | ContactHeroGroq
  | ContactSectionGroq
  | DonateFormSectionGroq
  | DonateInfoSectionGroq
  | DonorWallSectionGroq
  | NewsletterSectionGroq
  | ByTheNumbersSectionGroq
  | TestimonialSectionGroq
  | ToolsDevelopmentHeroGroq
  | ToolCategorySectionGroq
  | PartnerLogosSectionGroq
  | GetInvolvedIntroGroq
  | OtherWaysSectionGroq
  | DataGuideHeroGroq
  | DataGuideBodyGroq
  | AdvocacyHeroGroq
  | DataPreservationHeroGroq
  | FocusOnAccessSectionGroq
  | RiskNominateSectionGroq
  | MetadataStandardsSectionGroq
  | CardCarouselSectionGroq
  | SectionSpacerGroq

export type SitePageData = {
  title: string | null
  seo?: {
    title?: string | null
    description?: string | null
  } | null
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

  const pageTitle = data?.title?.trim()
  if (!data || !pageTitle) {
    notFound()
  }

  return buildPageMetadata({
    title: resolveSeoTitle(data.seo, pageTitle),
    description: resolveSeoDescription(data.seo),
    canonicalPath: `/${slugSegment}`,
  })
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
      const props = mapSimpleSectionToProps(section)
      return props ? (
        <SimpleSection key={section._key} {...props} headingId={`simple-section-${section._key}`} />
      ) : null
    }
    case 'byTheNumbersSection': {
      const props = mapByTheNumbersSectionToProps(section)
      return props ? <ByTheNumbersSection key={section._key} {...props} /> : null
    }
    case 'testimonialSection': {
      const props = mapTestimonialSectionToProps(section)
      return props ? <TestimonialSection key={section._key} {...props} /> : null
    }
    case 'toolsDevelopmentHero': {
      const props = mapToolsDevelopmentHeroToProps(section)
      return props ? <ToolsDevelopmentHero key={section._key} {...props} /> : null
    }
    case 'toolCategorySection': {
      const props = mapToolCategorySectionToProps(section, `tool-category-${section._key}`)
      return props ? <ToolCategorySection key={section._key} {...props} /> : null
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
    case 'textImageSection': {
      const props = mapTextImageSectionToProps(section)
      return props ? (
        <SectionBand key={section._key} className="bg-off-white">
          <SiteShell padding="grid" className="bg-cream py-10 md:py-12">
            <TextImageSection {...props} />
          </SiteShell>
        </SectionBand>
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
    case 'otherWaysSection': {
      const props = mapOtherWaysSectionToProps(section)
      return props ? <OtherWaysSection key={section._key} {...props} /> : null
    }
    case 'dataGuideHero': {
      // Handled by the Data Guide page composer (needs page title for h1).
      return null
    }
    case 'dataGuideBody': {
      const props = mapDataGuideBodyToProps(section)
      return props ? <DataGuideBodySection key={section._key} {...props} /> : null
    }
    case 'advocacyHero': {
      // Handled by the Advocacy page composer (needs page title for h1).
      return null
    }
    case 'dataPreservationHero': {
      // Handled by the Data Preservation page composer (needs page title for h1).
      return null
    }
    case 'focusOnAccessSection': {
      const props = mapFocusOnAccessSectionToProps(section)
      return props ? <FocusOnAccessSection key={section._key} {...props} /> : null
    }
    case 'riskNominateSection': {
      const props = mapRiskNominateSectionToProps(section)
      return props ? <RiskNominateSection key={section._key} {...props} /> : null
    }
    case 'metadataStandardsSection': {
      const props = mapMetadataStandardsSectionToProps(section)
      return props ? <MetadataStandardsSection key={section._key} {...props} /> : null
    }
    case 'cardCarouselSection': {
      const props = mapCardCarouselSectionToProps(section)
      return props ? <CardCarouselSection key={section._key} {...props} /> : null
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
    case 'getInvolvedIntro':
      // About / Contact / Donate / Get Involved pages are handled as composed pages below.
      return null
    case 'legalDocumentSection':
      // Schema validation keeps this as the sole section; defensive no-op if mixed.
      return null
    default:
      return null
  }
}

function renderDataGuidePageSection(section: SitePageSectionGroq, pageTitle: string) {
  switch (section._type) {
    case 'dataGuideHero': {
      const props = mapDataGuideHeroToProps(section, pageTitle)
      return props ? <DataGuideHeroSection key={section._key} {...props} /> : null
    }
    default:
      return renderMarketingSection(section)
  }
}

function renderAdvocacyPageSection(section: SitePageSectionGroq, pageTitle: string) {
  switch (section._type) {
    case 'advocacyHero': {
      const props = mapAdvocacyHeroToProps(section, pageTitle)
      return props ? <AdvocacyHeroSection key={section._key} {...props} /> : null
    }
    default:
      return renderMarketingSection(section)
  }
}

function renderDataPreservationPageSection(section: SitePageSectionGroq, pageTitle: string) {
  switch (section._type) {
    case 'dataPreservationHero': {
      const props = mapDataPreservationHeroToProps(section, pageTitle)
      return props ? <DataPreservationHeroSection key={section._key} {...props} /> : null
    }
    default:
      return renderMarketingSection(section)
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

/**
 * How We Work-style page: the page title and the leading run of Text + image
 * rows share one cream shell so the band reads as a single surface, with
 * off-white viewport rails above 1400px. Later sections keep their own bands.
 */
function TextImagePageBody({title, sections}: {title: string; sections: SitePageSectionGroq[]}) {
  const leadingRowCount = sections.findIndex((section) => section._type !== 'textImageSection')
  const splitAt = leadingRowCount === -1 ? sections.length : leadingRowCount
  const rows = sections.slice(0, splitAt) as TextImageSectionGroq[]
  const remainingSections = sections.slice(splitAt)

  return (
    <div className="flex flex-1 flex-col bg-off-white font-sans">
      <SectionBand className="bg-off-white">
        <SiteShell padding="grid" className="bg-cream pt-10 pb-12 md:pt-12 md:pb-16">
          <div className="flex flex-col gap-8 md:gap-12">
            <Grid12>
              <h1
                className={cn(
                  SECTION_LABEL_HEADING_CLASS,
                  'text-off-black col-span-12 min-w-0 lg:col-span-5 lg:col-start-2',
                )}
              >
                {title}
              </h1>
            </Grid12>
            {rows.map((row) => {
              const props = mapTextImageSectionToProps(row)
              return props ? <TextImageSection key={row._key} {...props} /> : null
            })}
          </div>
        </SiteShell>
      </SectionBand>
      {remainingSections.map((section) => renderMarketingSection(section))}
    </div>
  )
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

function renderGetInvolvedPageSection(section: SitePageSectionGroq, pageTitle: string) {
  switch (section._type) {
    case 'getInvolvedIntro': {
      const props = mapGetInvolvedIntroToProps(section, pageTitle)
      return props ? <GetInvolvedIntroSection key={section._key} {...props} /> : null
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

  const isTextImagePage = sections[0]?._type === 'textImageSection'
  if (isTextImagePage) {
    return <TextImagePageBody title={title} sections={sections} />
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

  const isGetInvolvedPage = sections[0]?._type === 'getInvolvedIntro'
  if (isGetInvolvedPage) {
    return (
      <div className="flex flex-1 flex-col bg-off-white font-sans">
        {sections.map((section) => renderGetInvolvedPageSection(section, title))}
      </div>
    )
  }

  const isToolsDevelopmentPage = sections[0]?._type === 'toolsDevelopmentHero'
  if (isToolsDevelopmentPage) {
    return (
      <div className="flex flex-1 flex-col bg-cream font-sans">
        {sections.map((section) => renderMarketingSection(section))}
      </div>
    )
  }

  const isDataGuidePage = sections[0]?._type === 'dataGuideHero'
  if (isDataGuidePage) {
    return (
      <div className="flex flex-1 flex-col font-sans">
        {sections.map((section) => renderDataGuidePageSection(section, title))}
      </div>
    )
  }

  const isAdvocacyPage = sections[0]?._type === 'advocacyHero'
  if (isAdvocacyPage) {
    return (
      <div className="flex flex-1 flex-col font-sans">
        {sections.map((section) => renderAdvocacyPageSection(section, title))}
      </div>
    )
  }

  const isDataPreservationPage = sections[0]?._type === 'dataPreservationHero'
  if (isDataPreservationPage) {
    return (
      <div className="flex flex-1 flex-col font-sans">
        {sections.map((section) => renderDataPreservationPageSection(section, title))}
      </div>
    )
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

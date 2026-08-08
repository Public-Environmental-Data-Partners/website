import {HomeHeroSection} from '@/components/home/hero-section'
import {HighlightBannerSection} from '@/components/home/highlight-banner-section'
import {NewsletterSection} from '@/components/home/newsletter-section'
import {SectionSpacer} from '@/components/home/section-spacer'
import {ByTheNumbersSection} from '@/components/sections/by-the-numbers-section'
import {CardCarouselSection} from '@/components/sections/card-carousel-section'
import {PartnerLogosSection} from '@/components/sections/partner-logos-section'
import {TestimonialSection} from '@/components/sections/testimonial-section'
import {WhatWeDoSection} from '@/components/sections/what-we-do-section'
import type {ContentLinkGroq} from '@/lib/content-link'
import type {ByTheNumbersSectionFields} from '@/lib/mappers/by-the-numbers-section'
import {mapByTheNumbersSectionToProps} from '@/lib/mappers/by-the-numbers-section'
import {mapCardCarouselSectionToProps} from '@/lib/mappers/card-carousel-section'
import type {HomeHeroFields} from '@/lib/mappers/hero-block'
import {mapHeroBlockToProps} from '@/lib/mappers/hero-block'
import {mapHighlightBannerSectionToProps} from '@/lib/mappers/highlight-banner-section'
import type {NewsletterSectionFields} from '@/lib/mappers/newsletter-section'
import {mapNewsletterSectionToProps} from '@/lib/mappers/newsletter-section'
import type {PartnerLogosSectionFields} from '@/lib/mappers/partner-logos-section'
import {mapPartnerLogosSectionToProps} from '@/lib/mappers/partner-logos-section'
import type {TestimonialSectionFields} from '@/lib/mappers/testimonial-section'
import {mapTestimonialSectionToProps} from '@/lib/mappers/testimonial-section'
import type {WhatWeDoSectionFields} from '@/lib/mappers/what-we-do-section'
import {mapWhatWeDoSectionToProps} from '@/lib/mappers/what-we-do-section'

type HighlightBannerSectionGroq = {
  _type: 'highlightBannerSection'
  _key: string
  sectionHeading?: string | null
  heading?: string | null
  body?: unknown[] | null
  ctaLabel?: string | null
  ctaLink?: ContentLinkGroq | null
  image?: {
    alt?: string | null
    asset?: {
      url?: string | null
      metadata?: {dimensions?: {width?: number | null; height?: number | null} | null} | null
    } | null
  } | null
}

type StoryCardGroq = {
  _type: 'storyCard'
  _key: string
  title?: string | null
  eyebrow?: string | null
  /** @deprecated Prefer `eyebrow`; kept for pre-migration content. */
  photoCredit?: string | null
  link?: ContentLinkGroq | null
  image?: HighlightBannerSectionGroq['image']
}

type CardCarouselSectionGroq = {
  _type: 'cardCarouselSection'
  _key: string
  sectionHeading?: string | null
  cards?: Array<StoryCardGroq> | null
}

type NewsletterSectionGroq = {
  _type: 'newsletterSection'
  _key: string
} & NewsletterSectionFields

type SectionSpacerGroq = {
  _type: 'sectionSpacer'
  _key: string
  heightPx?: number | null
  background?: string | null
}

export type HomeSectionGroq =
  | ({_type: 'homeHero'; _key: string} & HomeHeroFields)
  | ({_type: 'whatWeDoSection'; _key: string} & WhatWeDoSectionFields)
  | ({_type: 'testimonialSection'; _key: string} & TestimonialSectionFields)
  | ({_type: 'partnerLogosSection'; _key: string} & PartnerLogosSectionFields)
  | ({_type: 'byTheNumbersSection'; _key: string} & ByTheNumbersSectionFields)
  | HighlightBannerSectionGroq
  | CardCarouselSectionGroq
  | NewsletterSectionGroq
  | SectionSpacerGroq

/** `page.home`, where homepage is defined only by modular `sections[]`. */
export type PageHomeGroqData = {
  seo?: {
    title?: string | null
    description?: string | null
  } | null
  sections?: HomeSectionGroq[] | null
}

export function HomeSectionRow({section}: {section: HomeSectionGroq}) {
  switch (section._type) {
    case 'homeHero': {
      const props = mapHeroBlockToProps(section)
      return props ? <HomeHeroSection {...props} /> : null
    }
    case 'whatWeDoSection': {
      const props = mapWhatWeDoSectionToProps(section)
      return props ? <WhatWeDoSection {...props} /> : null
    }
    case 'testimonialSection': {
      const props = mapTestimonialSectionToProps(section)
      return props ? <TestimonialSection {...props} /> : null
    }
    case 'sectionSpacer':
      return typeof section.heightPx === 'number' ? (
        <SectionSpacer heightPx={section.heightPx} background={section.background} />
      ) : null
    case 'partnerLogosSection': {
      const props = mapPartnerLogosSectionToProps(section)
      return props ? (
        <PartnerLogosSection {...props} headingId={`partner-logos-${section._key}`} />
      ) : null
    }
    case 'byTheNumbersSection': {
      const props = mapByTheNumbersSectionToProps(section)
      return props ? <ByTheNumbersSection {...props} /> : null
    }
    case 'highlightBannerSection': {
      const props = mapHighlightBannerSectionToProps(section)
      return props ? <HighlightBannerSection {...props} /> : null
    }
    case 'cardCarouselSection': {
      const props = mapCardCarouselSectionToProps(section)
      return props ? <CardCarouselSection {...props} /> : null
    }
    case 'newsletterSection': {
      const props = mapNewsletterSectionToProps(section)
      return props ? <NewsletterSection {...props} /> : null
    }
    default:
      return null
  }
}

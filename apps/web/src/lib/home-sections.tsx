import {ByTheNumbersSection} from '@/components/home/by-the-numbers-section'
import {CardCarouselSection} from '@/components/home/card-carousel-section'
import {CoalitionSection} from '@/components/home/coalition-section'
import {HeroSection} from '@/components/home/hero-section'
import {HighlightBannerSection} from '@/components/home/highlight-banner-section'
import {NewsletterSection} from '@/components/home/newsletter-section'
import {SectionSpacer} from '@/components/home/section-spacer'
import {mapByTheNumbersSectionToProps} from '@/lib/mappers/by-the-numbers-section'
import {mapCardCarouselSectionToProps} from '@/lib/mappers/card-carousel-section'
import type {CoalitionFields} from '@/lib/mappers/coalition-block'
import {mapCoalitionBlockToProps} from '@/lib/mappers/coalition-block'
import type {HomeHeroFields} from '@/lib/mappers/hero-block'
import {mapHeroBlockToProps} from '@/lib/mappers/hero-block'
import {mapHighlightBannerSectionToProps} from '@/lib/mappers/highlight-banner-section'
import type {HomepageLinkTargetGroq} from '@/lib/mappers/homepage-link-target'
import {mapNewsletterSectionToProps} from '@/lib/mappers/newsletter-section'

type ByTheNumbersSectionGroq = {
  _type: 'byTheNumbersSection'
  _key: string
  kicker?: string | null
  stats?: Array<{_key?: string | null; value?: string | null; label?: string | null}> | null
}

type HighlightBannerSectionGroq = {
  _type: 'highlightBannerSection'
  _key: string
  kicker?: string | null
  titleLine?: string | null
  heading?: string | null
  body?: unknown[] | null
  ctaLabel?: string | null
  ctaLink?: HomepageLinkTargetGroq | null
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
  authors?: string | null
  chip?: string | null
  link?: HomepageLinkTargetGroq | null
  image?: HighlightBannerSectionGroq['image']
}

type ToolCardGroq = {
  _type: 'toolCard'
  _key: string
  title?: string | null
  description?: string | null
  chip?: string | null
  link?: HomepageLinkTargetGroq | null
  image?: HighlightBannerSectionGroq['image']
}

type CardCarouselSectionGroq = {
  _type: 'cardCarouselSection'
  _key: string
  sectionHeading?: string | null
  cards?: Array<StoryCardGroq | ToolCardGroq> | null
}

type NewsletterSectionGroq = {
  _type: 'newsletterSection'
  _key: string
  heading?: string | null
  body?: string | null
  emailPlaceholder?: string | null
  submitLabel?: string | null
}

type SectionSpacerGroq = {
  _type: 'sectionSpacer'
  _key: string
  heightPx?: number | null
}

export type HomeSectionGroq =
  | ({_type: 'homeHero'; _key: string} & HomeHeroFields)
  | ({_type: 'coalitionSection'; _key: string} & CoalitionFields)
  | ByTheNumbersSectionGroq
  | HighlightBannerSectionGroq
  | CardCarouselSectionGroq
  | NewsletterSectionGroq
  | SectionSpacerGroq

/** `page.home`, where homepage is defined only by modular `sections[]`. */
export type PageHomeGroqData = {
  sections?: HomeSectionGroq[] | null
}

export function HomeSectionRow({section}: {section: HomeSectionGroq}) {
  switch (section._type) {
    case 'homeHero': {
      const props = mapHeroBlockToProps(section)
      return props ? <HeroSection {...props} /> : null
    }
    case 'sectionSpacer':
      return typeof section.heightPx === 'number' ? (
        <SectionSpacer heightPx={section.heightPx} />
      ) : null
    case 'coalitionSection': {
      const props = mapCoalitionBlockToProps(section)
      return props ? <CoalitionSection {...props} /> : null
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

import {at, defineMigration, unset} from 'sanity/migrate'

/** Top-level homepage fields removed when home moved to `sections[]`; drop from persisted JSON */
const LEGACY_HOME_PAGE_FIELDS = [
  'heroKicker',
  'heroHeading',
  'heroParagraph1',
  'heroParagraph2',
  'heroImage',
  'heroImageMobile',
  'hideHeroImageOnMobile',
  'coalitionHeading',
  'coalitionPartners',
  'newsUpdatesHeading',
  'newsCards',
] as const

export default defineMigration({
  title: 'Unset home page legacy flat fields',
  documentTypes: ['page'],
  filter: "_id in ['page.home', 'drafts.page.home']",
  migrate: {
    document() {
      return LEGACY_HOME_PAGE_FIELDS.map((field) => at(field, unset()))
    },
  },
})

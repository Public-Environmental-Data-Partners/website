import {at, defineMigration, set} from 'sanity/migrate'

type CarouselCard = {_type?: string; [key: string]: unknown}

type CardCarouselSection = {
  _type?: string
  cards?: CarouselCard[] | null
  [key: string]: unknown
}

/**
 * Homepage carousel is story cards only. Drop any leftover `toolCard` entries
 * after Tools Development took over the tool-card shape.
 */
export default defineMigration({
  title: 'Remove tool cards from homepage card carousel',
  documentTypes: ['page'],
  migrate: {
    document(doc) {
      const sections = doc.sections
      if (!Array.isArray(sections)) {
        return []
      }

      let changed = false
      const nextSections = sections.map((section) => {
        if (
          !section ||
          typeof section !== 'object' ||
          (section as CardCarouselSection)._type !== 'cardCarouselSection'
        ) {
          return section
        }

        const carousel = section as CardCarouselSection
        const cards = Array.isArray(carousel.cards) ? carousel.cards : []
        const storyOnly = cards.filter((card) => card && card._type === 'storyCard')
        if (storyOnly.length === cards.length) {
          return section
        }

        changed = true
        return {...carousel, cards: storyOnly}
      })

      return changed ? [at('sections', set(nextSections))] : []
    },
  },
})

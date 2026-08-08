import {at, defineMigration, set} from 'sanity/migrate'

type CardRecord = {
  _key?: string
  _type?: string
  photoCredit?: unknown
  eyebrow?: unknown
  [field: string]: unknown
}

type SectionRecord = {
  _key?: string
  _type?: string
  cards?: CardRecord[] | null
  [field: string]: unknown
}

function nonEmptyString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value : undefined
}

/** Move legacy `photoCredit` → `eyebrow` on story cards inside carousel sections. */
export default defineMigration({
  title: 'Rename story card photoCredit to eyebrow',
  documentTypes: ['page', 'sitePage'],
  migrate: {
    document(doc) {
      if (!Array.isArray(doc.sections)) {
        return []
      }

      let changed = false
      const sections = (doc.sections as SectionRecord[]).map((section) => {
        if (!section || typeof section !== 'object' || section._type !== 'cardCarouselSection') {
          return section
        }
        if (!Array.isArray(section.cards)) {
          return section
        }

        let cardsChanged = false
        const cards = section.cards.map((card) => {
          if (!card || typeof card !== 'object' || card._type !== 'storyCard') {
            return card
          }
          if (card.photoCredit === undefined) {
            return card
          }
          const next: CardRecord = {...card}
          if (nonEmptyString(next.eyebrow) === undefined) {
            next.eyebrow = next.photoCredit
          }
          delete next.photoCredit
          cardsChanged = true
          return next
        })

        if (!cardsChanged) {
          return section
        }
        changed = true
        return {...section, cards}
      })

      return changed ? [at('sections', set(sections))] : []
    },
  },
})

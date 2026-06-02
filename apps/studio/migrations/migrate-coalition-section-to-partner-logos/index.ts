import {at, defineMigration, set, unset} from 'sanity/migrate'

type LegacyCoalitionSection = {
  _type?: string
  coalitionHeading?: string
  coalitionPartners?: unknown
}

/** Renames `coalitionSection` blocks to `partnerLogosSection` and field keys to match new schema. */
export default defineMigration({
  title: 'Migrate coalition section to partner logos section',
  documentTypes: ['page'],
  filter: "_id in ['page.home', 'drafts.page.home']",
  migrate: {
    document(doc) {
      const sections = doc.sections
      if (!Array.isArray(sections)) {
        return []
      }

      return sections.flatMap((section: LegacyCoalitionSection, index: number) => {
        if (section._type !== 'coalitionSection') {
          return []
        }

        const patches = [at(['sections', index, '_type'], set('partnerLogosSection'))]

        if (section.coalitionHeading !== undefined) {
          patches.push(
            at(['sections', index, 'heading'], set(section.coalitionHeading)),
            at(['sections', index, 'coalitionHeading'], unset()),
          )
        }

        if (section.coalitionPartners !== undefined) {
          patches.push(
            at(['sections', index, 'partners'], set(section.coalitionPartners)),
            at(['sections', index, 'coalitionPartners'], unset()),
          )
        }

        return patches
      })
    },
  },
})

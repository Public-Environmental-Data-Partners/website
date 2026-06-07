import {at, defineMigration, set, unset} from 'sanity/migrate'

type LegacyTeaser = {
  eyebrow?: string
  image?: unknown
}

/** Move shared fields to document root; drop legacy detail hero and teaser duplicates. */
export default defineMigration({
  title: 'Lift news post shared fields from teaser; remove detail hero',
  documentTypes: ['newsPost'],
  migrate: {
    document(doc) {
      const patches: ReturnType<typeof at>[] = []
      const teaser = doc.teaser as LegacyTeaser | undefined

      if (doc.eyebrow === undefined && teaser?.eyebrow !== undefined) {
        patches.push(at('eyebrow', set(teaser.eyebrow)))
      }

      if (doc.image === undefined && teaser?.image !== undefined) {
        patches.push(at('image', set(teaser.image)))
      }

      if (teaser?.eyebrow !== undefined) {
        patches.push(at(['teaser', 'eyebrow'], unset()))
      }

      if (teaser?.image !== undefined) {
        patches.push(at(['teaser', 'image'], unset()))
      }

      if (doc.hero !== undefined) {
        patches.push(at('hero', unset()))
      }

      return patches
    },
  },
})

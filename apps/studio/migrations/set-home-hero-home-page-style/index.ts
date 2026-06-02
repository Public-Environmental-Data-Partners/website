import {at, defineMigration, set} from 'sanity/migrate'

type HomeHeroSection = {
  _type?: string
  homePageStyle?: boolean
}

/** Existing homepage heroes predate `homePageStyle`; enable home layout on those blocks. */
export default defineMigration({
  title: 'Set homePageStyle on existing homepage hero blocks',
  documentTypes: ['page'],
  filter: "_id in ['page.home', 'drafts.page.home']",
  migrate: {
    document(doc) {
      const sections = doc.sections
      if (!Array.isArray(sections)) {
        return []
      }

      return sections.flatMap((section: HomeHeroSection, index: number) => {
        if (section._type !== 'homeHero' || section.homePageStyle === true) {
          return []
        }
        return [at(['sections', index, 'homePageStyle'], set(true))]
      })
    },
  },
})

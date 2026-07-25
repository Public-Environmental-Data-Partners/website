import {at, defineMigration, set} from 'sanity/migrate'

type SectionRecord = {
  _key?: string
  _type?: string
  [field: string]: unknown
}

/** Section types whose legacy `kicker` held the section label. */
const KICKER_LABEL_TYPES = new Set([
  'byTheNumbersSection',
  'highlightBannerSection',
  'newsletterSection',
  'testimonialSection',
])

/** Section types whose legacy `heading` held the section label, not a block title. */
const HEADING_LABEL_TYPES = new Set(['partnerLogosSection', 'whatWeDoSection'])

function nonEmptyString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value : undefined
}

/** Copy `from` into `to` when `to` is empty, then drop `from`. */
function moveField(section: SectionRecord, from: string, to: string): boolean {
  if (section[from] === undefined) {
    return false
  }
  if (nonEmptyString(section[to]) === undefined) {
    section[to] = section[from]
  }
  delete section[from]
  return true
}

function migrateSection(input: SectionRecord): SectionRecord | null {
  const type = input._type
  if (typeof type !== 'string') {
    return null
  }

  const next: SectionRecord = {...input}
  let changed = false

  if (KICKER_LABEL_TYPES.has(type)) {
    changed = moveField(next, 'kicker', 'sectionHeading') || changed
  }

  if (HEADING_LABEL_TYPES.has(type)) {
    changed = moveField(next, 'heading', 'sectionHeading') || changed
  }

  // Contact sections may store the label as `heading` or a later `kicker`.
  if (type === 'contactSection') {
    changed = moveField(next, 'kicker', 'sectionHeading') || changed
    changed = moveField(next, 'heading', 'sectionHeading') || changed
  }

  // Newsletter's instructional line moves after its label is resolved above.
  if (type === 'newsletterSection') {
    changed = moveField(next, 'heading', 'prompt') || changed
  }

  return changed ? next : null
}

/**
 * Align stored section-label fields with docs/content-terminology.md:
 * legacy `kicker` / label-role `heading` become `sectionHeading`, and the
 * newsletter's instructional `heading` becomes `prompt`.
 */
export default defineMigration({
  title: 'Rename section label fields to sectionHeading and prompt',
  documentTypes: ['page', 'sitePage'],
  migrate: {
    document(doc) {
      if (!Array.isArray(doc.sections)) {
        return []
      }

      let changed = false
      const sections = doc.sections.map((raw) => {
        if (!raw || typeof raw !== 'object') {
          return raw
        }
        const migrated = migrateSection(raw as SectionRecord)
        if (!migrated) {
          return raw
        }
        changed = true
        return migrated
      })

      return changed ? [at('sections', set(sections))] : []
    },
  },
})

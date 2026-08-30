import {defineField, defineType} from 'sanity'

import {CatalogDatasetDerivedInput} from '../components/catalog-dataset-derived-input'

/** Match Sanity client / Vision; used only for validation queries. */
const STUDIO_API_VERSION = '2024-01-01'

function siblingDocumentIds(documentId: string | undefined): string[] {
  if (!documentId) {
    return []
  }
  const base = documentId.startsWith('drafts.') ? documentId.slice(7) : documentId
  return Array.from(new Set([documentId, `drafts.${base}`, base]))
}

export const catalogMentionedInItem = defineType({
  name: 'catalogMentionedInItem',
  title: 'Mentioned in',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Link label',
      type: 'string',
      validation: (Rule) => Rule.required().max(160),
    }),
    defineField({
      name: 'link',
      title: 'Link',
      type: 'contentLink',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {title: 'label'},
  },
})

export const catalogDataset = defineType({
  name: 'catalogDataset',
  title: 'Catalog dataset',
  type: 'document',
  components: {input: CatalogDatasetDerivedInput},
  groups: [
    {name: 'identity', title: 'Identity', default: true},
    {name: 'agencies', title: 'Agencies'},
    {name: 'urls', title: 'URLs'},
    {name: 'dates', title: 'Dates'},
    {name: 'copy', title: 'Description'},
    {name: 'search', title: 'Search-only'},
    {name: 'editorial', title: 'Editorial'},
    {name: 'import', title: 'Import extras'},
  ],
  fields: [
    defineField({
      name: 'archivedTitle',
      title: 'Archived title',
      type: 'string',
      group: 'identity',
      description: 'Preferred card title. Falls back to dataset title if empty.',
      validation: (Rule) =>
        Rule.custom((archivedTitle, context) => {
          const archived = typeof archivedTitle === 'string' ? archivedTitle.trim() : ''
          const datasetTitle = context.document?.datasetTitle
          const dataset = typeof datasetTitle === 'string' ? datasetTitle.trim() : ''
          if (archived || dataset) return true
          return 'Add an archived title or dataset title. The public card needs one.'
        }),
    }),
    defineField({
      name: 'datasetTitle',
      title: 'Dataset title',
      type: 'string',
      group: 'identity',
    }),
    defineField({
      name: 'orgAbbrev',
      title: 'Org abbrev',
      type: 'string',
      group: 'identity',
      description: 'Single pill on the expanded card. Hidden if empty.',
    }),
    defineField({
      name: 'depositId',
      title: 'Deposit identifier',
      type: 'string',
      group: 'identity',
      description:
        'DOI, such as 10.5281/zenodo.123 or https://doi.org/10.5281/zenodo.123. Fills Import key. Used in search.',
    }),
    defineField({
      name: 'agency',
      title: 'Agency',
      type: 'string',
      group: 'agencies',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subAgency',
      title: 'Sub-agency / org',
      type: 'string',
      group: 'agencies',
    }),
    defineField({
      name: 'pedpAgencyForSorting',
      title: 'PEDP agency for sorting',
      type: 'string',
      group: 'agencies',
      description: 'Sort and search key. Not shown as its own line on the card.',
    }),
    defineField({
      name: 'originalUrl',
      title: 'Original location (URL)',
      type: 'url',
      group: 'urls',
    }),
    defineField({
      name: 'backupUrl',
      title: 'Backup location (URL)',
      type: 'url',
      group: 'urls',
      description:
        'When set, the expanded card links Metadata. When empty, the card shows Metadata pending.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'backupHost',
      title: 'Backup host',
      type: 'string',
      group: 'urls',
      description:
        'Filled from the backup URL (Zenodo, Harvard Dataverse, SciOp, GitHub). Used in Open in X. You can override it.',
    }),
    defineField({
      name: 'backupIsFile',
      title: 'Backup URL is a file',
      type: 'boolean',
      group: 'urls',
      initialValue: false,
      description:
        'Filled from the backup URL. When true, the card button says Download instead of Open in …',
    }),
    defineField({
      name: 'metadataDocUrl',
      title: 'PEDP metadata doc',
      type: 'url',
      group: 'urls',
      description:
        'When set, the expanded card links Metadata. When empty, the card shows Metadata pending.',
    }),
    defineField({
      name: 'timePeriodRaw',
      title: 'Time period (imported)',
      type: 'text',
      rows: 2,
      group: 'dates',
      readOnly: true,
    }),
    defineField({
      name: 'timePeriodStart',
      title: 'Time period start',
      type: 'date',
      group: 'dates',
      description:
        'If start and end are empty, the card shows See backup. Year-only import values may need review.',
    }),
    defineField({
      name: 'timePeriodEnd',
      title: 'Time period end',
      type: 'date',
      group: 'dates',
    }),
    defineField({
      name: 'timePeriodNeedsReview',
      title: 'Time period needs review',
      type: 'boolean',
      group: 'dates',
      initialValue: false,
    }),
    defineField({
      name: 'downloadDateRaw',
      title: 'Download date (imported)',
      type: 'string',
      group: 'dates',
      readOnly: true,
    }),
    defineField({
      name: 'downloadDate',
      title: 'Download date',
      type: 'date',
      group: 'dates',
    }),
    defineField({
      name: 'downloadDateNeedsReview',
      title: 'Download date needs review',
      type: 'boolean',
      group: 'dates',
      initialValue: false,
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 6,
      group: 'copy',
      description:
        'Preferred card description (about 450 characters / 5 lines). If empty, the imported Description is shown instead. Longer text is truncated with Read more on [host].',
    }),
    defineField({
      name: 'description',
      title: 'Description (imported)',
      type: 'text',
      rows: 8,
      group: 'copy',
      description:
        'Word-for-word metadata description from import. Default re-import does not change it if already filled. --overwrite replaces it from the CSV on a draft. Used on the card only when Summary is empty.',
    }),
    defineField({
      name: 'archiveNotes',
      title: 'Archive notes',
      type: 'text',
      rows: 4,
      group: 'copy',
    }),
    defineField({
      name: 'keywords',
      title: 'Keywords',
      type: 'text',
      rows: 2,
      group: 'copy',
      description:
        'Shown on the expanded card as a comma-separated list, above Mentioned in. Hidden if empty. Also used in search.',
    }),
    defineField({
      name: 'cchTerms',
      title: 'CCH terms',
      type: 'text',
      rows: 2,
      group: 'search',
    }),
    defineField({
      name: 'subject',
      title: 'Subject',
      type: 'text',
      rows: 2,
      group: 'search',
    }),
    defineField({
      name: 'mentionedIn',
      title: 'Mentioned in',
      type: 'array',
      group: 'editorial',
      of: [{type: 'catalogMentionedInItem'}],
    }),
    defineField({
      name: 'importKey',
      title: 'Import key',
      type: 'string',
      group: 'import',
      readOnly: true,
      description:
        'Filled from the DOI or backup URL. Used to match this record if the spreadsheet is imported again. You do not type this.',
      validation: (Rule) =>
        Rule.required()
          .error('Add a deposit identifier (DOI) or backup location URL.')
          .custom(async (value, context) => {
            const key = typeof value === 'string' ? value.trim() : ''
            if (!key) return true
            const {document, getClient} = context
            const client = getClient({apiVersion: STUDIO_API_VERSION})
            const exclude = siblingDocumentIds(document?._id)
            const count = await client.fetch<number>(
              `count(*[_type == "catalogDataset" && importKey == $key && !(_id in $exclude)])`,
              {key, exclude},
            )
            return count === 0 || 'A dataset with this DOI or backup URL already exists.'
          }),
    }),
    defineField({
      name: 'datasetSize',
      title: 'Dataset size',
      type: 'string',
      group: 'import',
    }),
    defineField({
      name: 'datasetSizeUnits',
      title: 'Dataset size units',
      type: 'string',
      group: 'import',
    }),
  ],
  preview: {
    select: {
      archivedTitle: 'archivedTitle',
      datasetTitle: 'datasetTitle',
      agency: 'agency',
    },
    prepare({archivedTitle, datasetTitle, agency}) {
      const title = (archivedTitle || datasetTitle || 'Untitled dataset').trim()
      return {title, subtitle: agency}
    },
  },
})

import type {PortableTextBlock} from '@portabletext/react'
import {draftMode} from 'next/headers'
import {cache} from 'react'

import {CONTENT_LINK_GROQ, type ContentLinkGroq, PT_BLOCKS_GROQ} from '@/lib/content-link'
import {sanityFetch} from '@/sanity/live'

export type DataCatalogCtaFields = {
  blurb?: string | null
  label?: string | null
  link?: ContentLinkGroq | null
} | null

export type DataCatalogPageData = {
  title?: string | null
  intro?: PortableTextBlock[] | null
  dataGuide?: DataCatalogCtaFields
  nominateData?: DataCatalogCtaFields
  seo?: {
    title?: string | null
    description?: string | null
  } | null
} | null

export type CatalogDatasetFields = {
  _id: string
  archivedTitle?: string | null
  datasetTitle?: string | null
  orgAbbrev?: string | null
  depositId?: string | null
  agency?: string | null
  subAgency?: string | null
  pedpAgencyForSorting?: string | null
  originalUrl?: string | null
  backupUrl?: string | null
  backupHost?: string | null
  backupIsFile?: boolean | null
  metadataDocUrl?: string | null
  timePeriodStart?: string | null
  timePeriodEnd?: string | null
  downloadDate?: string | null
  summary?: string | null
  description?: string | null
  archiveNotes?: string | null
  keywords?: string | null
  cchTerms?: string | null
  subject?: string | null
  mentionedIn?: Array<{
    _key?: string
    label?: string | null
    link?: ContentLinkGroq | null
  } | null> | null
}

const PAGE_QUERY = `*[_type == "dataCatalogPage" && _id == "page.dataCatalog"][0]{
  title,
  intro[]${PT_BLOCKS_GROQ},
  dataGuide {
    blurb,
    label,
    link${CONTENT_LINK_GROQ}
  },
  nominateData {
    blurb,
    label,
    link${CONTENT_LINK_GROQ}
  },
  seo {
    title,
    description
  }
}`

const DATASETS_QUERY = `*[_type == "catalogDataset"] | order(coalesce(archivedTitle, datasetTitle) asc) {
  _id,
  archivedTitle,
  datasetTitle,
  orgAbbrev,
  depositId,
  agency,
  subAgency,
  pedpAgencyForSorting,
  originalUrl,
  backupUrl,
  backupHost,
  backupIsFile,
  metadataDocUrl,
  timePeriodStart,
  timePeriodEnd,
  downloadDate,
  summary,
  "description": select(defined(summary) && length(summary) > 0 => null, description),
  archiveNotes,
  keywords,
  cchTerms,
  subject,
  mentionedIn[]{
    _key,
    label,
    link${CONTENT_LINK_GROQ}
  }
}`

export const getDataCatalogPage = cache(
  async function getDataCatalogPage(): Promise<DataCatalogPageData> {
    const {isEnabled: isDraftMode} = await draftMode()
    const {data} = await sanityFetch({
      query: PAGE_QUERY,
      perspective: isDraftMode ? 'drafts' : 'published',
    })
    return data as DataCatalogPageData
  },
)

export const getCatalogDatasets = cache(async function getCatalogDatasets(): Promise<
  CatalogDatasetFields[]
> {
  const {isEnabled: isDraftMode} = await draftMode()
  const {data} = await sanityFetch({
    query: DATASETS_QUERY,
    perspective: isDraftMode ? 'drafts' : 'published',
  })
  return (data as CatalogDatasetFields[] | null) ?? []
})

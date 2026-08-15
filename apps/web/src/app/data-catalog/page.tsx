import type {Metadata} from 'next'

import {DataCatalogPageView} from '@/components/data-catalog/data-catalog-page-view'
import {mapCatalogCta, mapCatalogDataset} from '@/lib/mappers/catalog-dataset'
import {buildPageMetadata, resolveSeoDescription, resolveSeoTitle} from '@/lib/metadata/page-seo'
import {getCatalogDatasets, getDataCatalogPage} from '@/lib/queries/data-catalog'

export const dynamic = 'force-dynamic'

const DEFAULT_TITLE = 'Data Catalog'
const PATH = '/data-catalog'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getDataCatalogPage()
  const title = resolveSeoTitle(page?.seo, page?.title?.trim() || DEFAULT_TITLE)
  return buildPageMetadata({
    title,
    description: resolveSeoDescription(page?.seo),
    canonicalPath: PATH,
  })
}

export default async function DataCatalogRoute() {
  const [page, docs] = await Promise.all([getDataCatalogPage(), getCatalogDatasets()])
  const title = page?.title?.trim() || DEFAULT_TITLE
  const intro = page?.intro ?? null
  const datasets = docs
    .map((doc) => mapCatalogDataset(doc))
    .filter((card): card is NonNullable<typeof card> => card !== null)

  return (
    <DataCatalogPageView
      title={title}
      intro={intro}
      datasets={datasets}
      dataGuide={mapCatalogCta(page?.dataGuide ?? null)}
      nominateData={mapCatalogCta(page?.nominateData ?? null)}
    />
  )
}

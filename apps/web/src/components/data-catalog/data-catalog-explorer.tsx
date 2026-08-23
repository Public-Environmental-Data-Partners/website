'use client'

import {ChevronLeft, ChevronRight, Minus, Plus, Search} from 'lucide-react'
import {type FormEvent, useMemo, useState} from 'react'

import {ContentLink} from '@/components/content-link'
import {Button} from '@/components/ui/button'
import {
  catalogButtonLabel,
  type CatalogCardProps,
  type CatalogCtaProps,
  catalogPageItems,
  filterCatalogCards,
  paginateCatalog,
  sortCatalogCards,
} from '@/lib/mappers/catalog-dataset'
import {cn} from '@/lib/utils'

type SortKey = 'name' | 'agency'
type SortDir = 'asc' | 'desc'

function CatalogCtaCard({
  cta,
  slot,
  buttonClassName,
}: {
  cta: CatalogCtaProps
  slot: 'data-catalog-guide' | 'data-catalog-nominate'
  buttonClassName: string
}) {
  return (
    <aside data-slot={slot} className="flex flex-col gap-6 rounded-md p-6">
      {cta.blurb ? <p data-slot="data-catalog-cta-blurb">{cta.blurb}</p> : null}
      {cta.href && cta.label ? (
        <div className="flex justify-center">
          <Button asChild size="cta" className={cn('px-6', buttonClassName)}>
            <ContentLink href={cta.href} external={cta.external}>
              {cta.label}
            </ContentLink>
          </Button>
        </div>
      ) : null}
    </aside>
  )
}

function DatasetCard({card}: {card: CatalogCardProps}) {
  const [open, setOpen] = useState(false)
  const buttonLabel = catalogButtonLabel(card)
  const panelId = `${card.id}-panel`

  return (
    <article data-slot="data-catalog-card" className="relative">
      <button
        type="button"
        data-slot="data-catalog-expand"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? (
          <Minus className="size-10" strokeWidth={3} aria-hidden />
        ) : (
          <Plus className="size-10" strokeWidth={3} aria-hidden />
        )}
        <span className="sr-only">{open ? 'Collapse dataset' : 'Expand dataset'}</span>
      </button>
      <h2 data-slot="data-catalog-card-title">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
        >
          {card.title}
        </button>
      </h2>
      {open ? (
        <div id={panelId} className="mt-6 flex flex-col gap-6">
          {card.description ? (
            <div>
              <p data-slot="data-catalog-body">{card.description}</p>
              {card.descriptionTruncated ? (
                <p className="mt-2">
                  <ContentLink
                    href={card.backupUrl}
                    external
                    className="font-sans text-[1.375rem] text-off-black underline underline-offset-2"
                  >
                    Read more on {card.backupHost}
                  </ContentLink>
                </p>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}
      <div
        id={panelId}
        className="mt-10 grid grid-cols-9 items-baseline gap-x-[var(--grid-gutter)] gap-y-6 lg:mt-12"
      >
        <p data-slot="data-catalog-meta-label" className="col-span-9 lg:col-span-4">
          {card.agency}
        </p>
        <p className="col-span-9 m-0 text-[1.375rem] leading-none lg:col-span-4 lg:col-start-6">
          <span data-slot="data-catalog-meta-label">Time Period: </span>
          <span data-slot="data-catalog-date">{card.timePeriodLabel}</span>
        </p>
        <p
          data-slot="data-catalog-meta-label"
          className="col-span-9 lg:col-span-4"
          aria-hidden={!card.subAgency}
        >
          {card.subAgency || '\u00a0'}
        </p>
        <p className="col-span-9 m-0 text-[1.375rem] leading-none lg:col-span-4 lg:col-start-6">
          <span data-slot="data-catalog-meta-label">Download Date: </span>
          <span data-slot="data-catalog-date">{card.downloadDateLabel}</span>
        </p>
        {open && card.orgAbbrev ? (
          <p className="col-span-9 lg:col-span-4">
            <span data-slot="data-catalog-org-pill">{card.orgAbbrev}</span>
          </p>
        ) : null}
        {open && card.metadataDocUrl ? (
          <p className="col-span-9 lg:col-span-4 lg:col-start-6">
            <ContentLink
              href={card.metadataDocUrl}
              external
              className="font-sans text-[1.375rem] text-off-black underline underline-offset-2"
            >
              Metadata
            </ContentLink>
          </p>
        ) : null}
      </div>
      {open ? (
        <div className="mt-6 flex flex-col gap-6">
          {card.originalUrl ? (
            <p>
              <ContentLink
                href={card.originalUrl}
                external
                className="font-sans text-[1.375rem] text-off-black underline underline-offset-2"
              >
                Original URL
              </ContentLink>
            </p>
          ) : null}
          {card.archiveNotes ? (
            <div>
              <h3 data-slot="data-catalog-section-label">Archive Notes:</h3>
              <p data-slot="data-catalog-body" className="mt-2">
                {card.archiveNotes}
              </p>
            </div>
          ) : null}
          {card.keywords ? (
            <div>
              <h3 data-slot="data-catalog-section-label">Keywords:</h3>
              <p data-slot="data-catalog-body" className="mt-2">
                {card.keywords}
              </p>
            </div>
          ) : null}
          {card.mentionedIn.length > 0 ? (
            <div>
              <h3 data-slot="data-catalog-section-label">Mentioned in:</h3>
              <ul className="mt-2 flex flex-col gap-1">
                {card.mentionedIn.map((item) => (
                  <li key={item.key}>
                    <ContentLink
                      href={item.href}
                      external={item.external}
                      className="font-sans text-[1.375rem] text-off-black underline underline-offset-2"
                    >
                      {item.label}
                    </ContentLink>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          <div className="flex justify-end">
            <Button asChild size="cta" variant="offBlack" className="px-6 text-off-white">
              <ContentLink href={card.backupUrl} external>
                {buttonLabel}
              </ContentLink>
            </Button>
          </div>
        </div>
      ) : null}
    </article>
  )
}

export function DataCatalogExplorer({
  datasets,
  dataGuide,
  nominateData,
}: {
  datasets: CatalogCardProps[]
  dataGuide: CatalogCtaProps | null
  nominateData: CatalogCtaProps | null
}) {
  const [draftQuery, setDraftQuery] = useState('')
  const [query, setQuery] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('name')
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [page, setPage] = useState(1)

  function onSearch(event: FormEvent) {
    event.preventDefault()
    setQuery(draftQuery)
    setPage(1)
  }

  function onSort(next: SortKey) {
    if (sortKey === next) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(next)
      setSortDir('asc')
    }
    setPage(1)
  }

  const filtered = useMemo(() => {
    const found = filterCatalogCards(datasets, query)
    return sortCatalogCards(found, sortKey, sortDir)
  }, [datasets, query, sortKey, sortDir])

  const {slice, totalPages, page: safePage} = paginateCatalog(filtered, page)
  const pages = catalogPageItems(totalPages, safePage)
  const count = datasets.length
  const hasSearch = query.trim().length > 0
  const resultCountLabel = `${filtered.length} data set${filtered.length === 1 ? '' : 's'}`

  const sidebar = (
    <div className="flex flex-col gap-6">
      {dataGuide ? (
        <CatalogCtaCard
          cta={dataGuide}
          slot="data-catalog-guide"
          buttonClassName="bg-dark-green text-light-green hover:bg-dark-green/90"
        />
      ) : null}
      {nominateData ? (
        <CatalogCtaCard
          cta={nominateData}
          slot="data-catalog-nominate"
          buttonClassName="bg-dark-blue text-ice-blue hover:bg-dark-blue/90"
        />
      ) : null}
    </div>
  )

  return (
    <div className="grid grid-cols-12 gap-[var(--grid-gutter)] gap-y-10">
      <div className="col-span-12 order-2 lg:order-1 lg:col-span-3">{sidebar}</div>
      <div className="col-span-12 order-1 min-[87.5rem]:pe-[var(--site-padding-x)] lg:order-2 lg:col-span-9">
        <form
          onSubmit={onSearch}
          className="grid grid-cols-12 items-stretch gap-x-[var(--grid-gutter)] gap-y-3"
        >
          <label className="sr-only" htmlFor="data-catalog-search">
            Search datasets
          </label>
          <input
            id="data-catalog-search"
            data-slot="data-catalog-search-input"
            className="col-span-12 lg:col-span-10"
            value={draftQuery}
            onChange={(e) => setDraftQuery(e.target.value)}
            placeholder={`Search ${count} datasets...`}
          />
          <Button
            type="submit"
            size="cta"
            className="col-span-12 w-full min-w-0 bg-pedp-green px-6 text-pale-green hover:bg-pedp-green/90 lg:col-span-2"
          >
            Search
            <Search className="size-5" aria-hidden />
          </Button>
        </form>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <p data-slot="data-catalog-sort-label" id="data-catalog-sort">
            Sort by
          </p>
          <div className="flex flex-wrap gap-3" role="group" aria-labelledby="data-catalog-sort">
            <button
              type="button"
              data-slot="data-catalog-sort-pill"
              data-active={sortKey === 'name'}
              onClick={() => onSort('name')}
            >
              Dataset Name {sortKey === 'name' ? (sortDir === 'asc' ? '(A-Z)' : '(Z-A)') : ''}
            </button>
            <button
              type="button"
              data-slot="data-catalog-sort-pill"
              data-active={sortKey === 'agency'}
              onClick={() => onSort('agency')}
            >
              Agency {sortKey === 'agency' ? (sortDir === 'asc' ? '(A-Z)' : '(Z-A)') : ''}
            </button>
          </div>
        </div>
        <div className="mt-8 flex flex-col gap-4">
          {hasSearch ? (
            <p data-slot="data-catalog-results-summary" role="status">
              Showing {resultCountLabel} matching your search
            </p>
          ) : null}
          {slice.length === 0 ? (
            <p data-slot="data-catalog-body">No datasets match this search.</p>
          ) : (
            slice.map((card) => <DatasetCard key={card.id} card={card} />)
          )}
        </div>
        {totalPages > 1 ? (
          <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Catalog pages">
            <button
              type="button"
              className="p-2 text-off-black disabled:opacity-40"
              disabled={safePage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft aria-hidden />
              <span className="sr-only">Previous page</span>
            </button>
            {pages.map((item, i) =>
              item === 'ellipsis' ? (
                <span key={`e-${i}`} className="px-1 text-off-black">
                  …
                </span>
              ) : (
                <button
                  key={item}
                  type="button"
                  data-slot="data-catalog-page-link"
                  data-active={item === safePage}
                  className="flex size-10 items-center justify-center rounded-full font-sans text-off-black"
                  onClick={() => setPage(item)}
                  aria-current={item === safePage ? 'page' : undefined}
                >
                  {item}
                </button>
              ),
            )}
            <button
              type="button"
              className="p-2 text-off-black disabled:opacity-40"
              disabled={safePage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              <ChevronRight aria-hidden />
              <span className="sr-only">Next page</span>
            </button>
          </nav>
        ) : null}
      </div>
    </div>
  )
}

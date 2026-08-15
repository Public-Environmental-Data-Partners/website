# Data Catalog limited-set manual test

Checklist for the sample / early published catalog (a handful of datasets)
while the full ~350-row set is not in Studio. Product rules stay in
[`docs/decisions/0011-data-catalog.md`](../decisions/0011-data-catalog.md).
Import commands: [`docs/ops/data-catalog-import.md`](./data-catalog-import.md).
Editor publish: [`docs/content-managers.md`](../content-managers.md).

This is a manual pass, not CI. Remove or rewrite it after the full set lands
and the “full catalog” section has been run.

Page size is 10 (`CATALOG_PAGE_SIZE`). With fewer than 11 published cards the
pager does not appear. That is expected.

## Out of scope until the full set

* First-load payload size and search over hundreds of rows
* As-you-type search, search chips, catalog in primary nav
* Finished Data Guide page (CTA may 404 until that page exists)
* Year-only time period display polish
* Dataset size on the card or in search

## Preconditions

* Data Catalog page document is published (title, intro, Data Guide, Nominate,
  SEO).
* At least a few `catalogDataset` documents are published.
* At least one imported dataset is left as a draft (must not appear on the
  public page).
* Public site: `/data-catalog`. Draft preview URL as in the content editors
  guide.

## Import

* `--dry-run` logs intended `drafts.catalog.…` ids and does not write.
* Real import creates drafts. New rows do not appear publicly until Publish.
* A row with neither DOI nor backup URL logs `SKIP`.
* After filling Summary in Studio, re-import does not change that Summary.
  Empty fields can still fill from the CSV.
* Backup host on a sample URL is Zenodo, Harvard Dataverse, SciOp, GitHub, or
  Archive. A file-like backup URL uses the Download button.

## Public page chrome

* `/data-catalog` loads. It is not in the main navigation.
* Hero shows the Studio title and intro. An intro content link works if set.
* Data Guide and Nominate CTAs show blurbs and labels. External Nominate opens
  in a new tab.
* Search placeholder count equals published datasets, not drafts plus
  published.
* Browser tab / SEO follow the page SEO fields (or the page title fallback).

## Copy, links, and buttons

Check Studio-managed copy and every control, not only card layout.

Copy:

* Hero title and intro match Studio, including line breaks and inline marks.
* Data Guide and Nominate blurbs and button labels match Studio.
* Empty-state copy (“No datasets match this search.”) and date fallbacks
  (“See backup”, “Not recorded”) still read correctly.

Links:

* Hero intro content links (internal, external, email) go to the right place.
  External links open in a new tab with the external icon.
* Data Guide CTA goes to `/data-guide` (or the Studio href). Expect 404 until
  that Site page is published.
* Nominate CTA uses the Studio URL and opens in a new tab.
* On cards: Open in / Download, Read more on [host], Metadata, Original URL,
  and Mentioned in each hit the stored URL. Missing URL means the control is
  absent, not a dead link.

Buttons:

* Search submits the query. Enter in the field does the same.
* Sort pills select and reverse as documented below.
* Expand plus / minus toggles the card and has an accessible name.
* Open in vs Download matches backup URL type (page vs file-like).

## Mentioned in

Studio-only (not in the CSV). Import must not add, overwrite, or clear it.

* On one published card, add at least one internal item (news post or site
  page) and one external URL, each with a label. Publish.
* Collapsed card: Mentioned in is hidden.
* Expanded card: “Mentioned in:” lists the labels. Internal opens same tab.
  External opens a new tab with the external icon.
* A row with no label or no link is omitted.
* A card with an empty Mentioned in array does not show the heading.
* Re-import the same CSV row: Mentioned in is unchanged.


## Draft vs published

* Unpublished dataset is absent from the public catalog.
* Draft preview shows that unpublished card.
* After Publish, a refresh shows it on the public page.

## Cards

Collapsed:

* Title is Archived Title, else Dataset Title.
* Agency and Time Period share a row; Sub-agency and Download Date share the
  next row; Open in / Download is centered under that.
* PEDP Agency for Sorting is not a third agency line.
* Description, notes, Mentioned in, and Metadata are not shown until expand.

Expanded:

* Plus / minus control. Two cards can stay open at once.
* Description area uses Summary, or imported Description if Summary is empty.
* Text longer than 450 characters is truncated and shows Read more on [host]
  (same backup URL).
* Org abbrev pill only if that field is set.
* Metadata link only if a URL exists (no “Metadata unavailable”).
* Original URL, Archive notes, and Mentioned in when those fields are set.
* Open in / Download sits after Archive notes and Mentioned in.

Dates:

* Parsed values display as `M/D/YYYY` (or a start-end pair).
* Blank / unparsed time period: “See backup”.
* Blank / unparsed download date: “Not recorded”.

## Search and sort

* Typing in the field does not filter until Search or Enter.
* A token in title, agency, PEDP Agency for Sorting, notes, keywords, summary
  or description, time period, CCH terms, subject, or DOI finds the card.
* Backup URL and download date are not search keys.
* Nonsense query shows “No datasets match this search.”
* Default sort is Dataset Name A-Z. Second click on the same pill reverses.
* Agency sort uses PEDP Agency for Sorting, then Agency. Search or sort resets
  to page 1.

## Pagination (limited set)

* With 10 or fewer published matches: no pager. All matching cards on one page.
* To exercise the pager before the full set: temporarily set `CATALOG_PAGE_SIZE`
  to 2 in `apps/web/src/lib/mappers/catalog-dataset.ts`, confirm next/prev and
  that search/sort return to page 1, then set it back to 10. Do not ship 2.

## Layout and access (spot check)

* Mobile: tighter card padding; search and cards above the CTAs; Search button
  on its own row.
* Desktop: CTAs in the left 3 columns; search and cards in 9; meta columns
  4 / gap / 4.
* Expand control has an accessible name. Keyboard can submit search (Enter).

## After the full set lands

Re-run search and agency sort across many orgs, pagination ellipsis on high
page counts, and a rough check that the first catalog response stays
reasonable with short Summaries. Then delete or replace this document.

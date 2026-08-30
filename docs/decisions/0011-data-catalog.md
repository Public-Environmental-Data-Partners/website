---
status: "accepted"
date: "2026-08-15"
---

# Data Catalog page, dataset documents, and CSV import

## Context and Problem Statement

PEDP needs a public Data Catalog at `/data-catalog` that lists ~350 archived
federal datasets. Cards expand for detail. Editors must review and enrich
records in Sanity after a spreadsheet import. Search, sort, and pagination must
work without a dedicated search product. This record captures v1 decisions,
assumptions, and explicit non-goals. How to run import and how editors publish
lives in [`docs/ops/data-catalog-import.md`](../ops/data-catalog-import.md) and
[`docs/content-managers.md`](../content-managers.md) (Data Catalog section).

## Decision Drivers

* Editors can fix copy in Studio after import (especially Summary and Mentioned in).
* The public site only shows published documents.
* Import of ~350 rows must be repeatable enough not to duplicate records, without
  a Studio CSV uploader in v1.
* Payload size stays reasonable if the browser loads the published catalog.
* UI matches the Figma catalog comps (desktop and mobile).
* Field mapping follows `Dataset Field Index - Dataset Import.csv`. The live
  inventory of catalog CSV headers versus the import script and Sanity is
  [`docs/ops/data-catalog-csv-fields.md`](../ops/data-catalog-csv-fields.md).

## Assumptions

* Each catalog row is one Sanity dataset document. One row equals one deposit
  (one DOI, or one backup URL if DOI is missing).
* Deposit Digital Identifier is a full `https://doi.org/...` URL. A `doi:` prefix
  in sample data is treated as a typo. Import normalizes DOIs (trim, lowercase,
  strip the `https://doi.org/` prefix) before using them as the unique key.
* If DOI is missing, the unique key is the normalized backup URL (Dataverse
  first, then Zenodo, if the cell has multiple URLs). Percent-encoded backup
  URLs are decoded before the key is built, so `doi:` and `doi%3A` forms of
  the same Dataverse link are one document. If both DOI and backup URL
  are missing, the row is not imported and is written to a review list.
* Backup URLs that are themselves DOI links resolve to the same key as the DOI
  so two rows do not become two documents for one deposit.
* Display title is Archived Title, else Dataset Title.
* Field display rules (Summary, Description, dates, backup host) are listed
  under Field behavior below.
* Download Date blank shows "Not recorded". If the source has multiple dates,
  use the earliest.
* PEDP Agency for Sorting is a short grouping label for Agency sort and search.
  It is not a third visible agency line. Visible lines are Agency then
  Sub-Agency/Org.
* Org Abbrev (CSV column today: Agency or Org Abbrev) drives a single pill.
  Blank means no pill. Rename the CSV column to Org Abbrev when convenient.
* Mentioned in is Studio-only (internal news/blog and/or external URLs). CSV
  does not include it.
* Data Guide is an internal page to be designed later. Nominate Data is an
  external form. Labels, blurbs, and links live on the catalog page document.
* The page is not in the main nav. The homepage Browse Archived Data control
  links to `/data-catalog`.
* Desktop white band is Grid12 spans 3 (CTAs) + 9 (search and cards). Mobile
  stacks search, cards, pagination, then Data Guide, then Nominate.
* Hero is a full-bleed row: `#C4EDAC` in the left margin outside the site shell,
  `#E8FFDB` for the rest of that row. Content below the hero is white.
* Typography uses Figtree for UI (no Inter). Hero title uses Source Serif 4.
  Desktop type sizes apply on mobile unless a comp clearly disagrees.
* Search input fill is `#FFFCF8`, border `#D4CBBF`. Other colors are as specified
  in the catalog design conversation (map to existing CSS tokens where possible).
* Icons follow existing site patterns (Lucide or current custom SVGs). Card
  photos are not part of v1.
* Dataset Size and size units are not shown and not searched. Product still
  needs a later decision on size.
* "Required in Sanity" means editors can edit those fields after import. It does
  not mean every imported field must be filled before first publish, except that
  drafts must be published to appear.

## Field behavior

Canonical rules for card copy and derived fields. Change this section when the
product rule changes. Studio field descriptions and the editor guide should
match this section, not invent a second spec.

### Description (imported)

Stores the metadata description word for word from the source / metadata doc.
Import does not rewrite it. It is not the preferred public text. Use it as the
backup for the card Description area only when Summary is empty.

### Summary

Preferred text for the card Description area. If Summary is blank, use the
imported Description field instead. Max length on the card is 450 characters
(about 5 lines). If the chosen text is longer, truncate and show the design
"Read more on [host]" link (same backup URL as the Open in / Download button).
Do not show the raw metadata Description on the card when Summary exists.

### Time Period / Temporal Resolution

Not required in the UI. If the parsed start (and end) dates are blank, the card
shows "See backup". Keep the imported raw string for editors. Year-only values
stay unparsed in v1 (`needsReview` plus this fallback).

### Download Date

If blank or unparsed, the card shows "Not recorded".

### Keywords

Shown on the expanded card above Mentioned in as a comma-separated string.
Hidden if empty. Still included in client-side search.

### Backup Host

Not a CSV column. Import (or an editor override) sets it by parsing the backup
location URL. Used in the button label "Open in X", where X is a host name such
as Zenodo, Harvard Dataverse, SciOp, or GitHub. If the URL looks like a file
(for example it ends in an extension such as `.zip`), the button says
"Download" instead of "Open in". The host can still be recorded as wherever the
file is hosted (for example AWS). Unknown hosts fall back to "Archive".

## Considered Options

### Catalog content model

* One Sanity document per dataset, plus a separate catalog page document for
  chrome (hero, CTAs, SEO).
* Embed all datasets on the page document (not viable at ~350).
* Hardcode datasets in the repo (rejects editor workflow).

### Import

* One-time / occasional Node (or similar) script: CSV to Sanity API, then Studio
  review.
* Studio CSV upload plugin.
* Repeatable upsert that overwrites CSV-mapped fields on every run.
* Full replace from CSV (wipes editor work).

### Unique key

* Normalized DOI, else backup URL, else skip.
* Title-only key (collides).
* Spreadsheet row number (unstable).

### Re-import

* Never overwrite a Sanity field that already has a value (v1).
* Overwrite CSV-mapped fields, never Summary or Mentioned in (revisit in a
  follow-up to this ADR).
* Full replace.

### Search

* Load published datasets in the browser. Filter on Search click or Enter.
  Do not ship full Description in the list payload when Summary exists.
* Server / GROQ pagination per query.
* As-you-type filtering.
* Dedicated search (Algolia or similar).
* Clickable suggested-term chips / keyword pills that run a search.

### Time and download dates

* Best-effort parse into date fields, `needsReview` when parse fails, still
  publishable. Display `MM/DD/YYYY` (or `MM/DD/YYYY - MM/DD/YYYY`) or the
  fallback copy.
* Block publish until dates are valid.
* Show the raw CSV string on the card.
* No parser: leave dates empty until editors type them.

### Sort UI

* Sort by label plus two buttons (Dataset Name, Agency). Active click reverses
  direction. Same on desktop and mobile.
* Single dropdown (early desktop comps only).

## Decision Outcome

Chosen for v1:

1. New route `/data-catalog`. Catalog page document in Studio (hero title, Portable
   Text intro with content links, Data Guide
   internal CTA, Nominate external CTA, SEO). Dataset documents listed by the
   page, not nested on it.
2. Import script from CSV. Documents created as drafts. Public catalog queries
   published documents only.
3. Unique key: normalized DOI, else normalized backup URL. Skip and flag
   otherwise. Also skip missing title, missing agency, unusable backup URL, and
   duplicate import keys in the same CSV (first row wins). `--check-data`
   reports those errors plus card-thinness warnings without writing.
4. Re-import fills empty fields only by default. Existing Studio values win.
   `--overwrite` replaces fields whose CSV columns are present, writes a draft
   (never the published document), and does not clear Summary unless the CSV
   has a non-empty Summary. Mentioned in is never imported. A changed DOI is a
   new key and does not update the old document.
5. Client-side search, sort, and pagination on the published list payload.
   Search commits on button or Enter. Placeholder includes the published
   dataset count. Search fields follow the import index (name, archived title,
   agencies including PEDP Agency for Sorting, notes, keywords, description /
   summary, time period, CCH terms, subject, deposit identifier). Do not search
   URLs or download date. List payload omits full Description when a short
   Summary can be sent instead.
6. Page size 10, hardcoded, same on all breakpoints. Not a Studio field.
7. Multiple cards may stay expanded. Expand control is + / -.
8. Open in [host] / Download uses backup URL and host parsed from that URL
   (Zenodo, Harvard Dataverse, SciOp, GitHub, or Download when the URL looks
   like a file). New tab. Read more on [host] is the same backup URL after
   truncated Summary. Original Location is a separate expanded-card link.
   Metadata (PEDP Metadata Doc) is a link when the URL is set. When it is blank
   the expanded card shows Metadata pending (not a link). Mentioned in and
   Nominate open in a new tab when external.
9. Time Period and Download Date: parse when possible, set `needsReview` when
   not, keep raw import string for editors, do not block publish. Year-only
   values are unparsed in v1 (flag + fallback copy).
10. Sort: "Sort by" plus two buttons. Default Dataset Name A-Z. Agency sort uses
    PEDP Agency for Sorting, then Agency.

## Consequences

* First catalog load ships all published card/search fields (on the order of
  hundreds of KB gzipped if Summary stays short). If Descriptions are huge and
  Summaries are empty, payload grows and we may fetch Description on expand
  later.
* Editors must publish drafts before rows appear. A bulk publish in Studio is
  an operational step, not a script default.
* Re-import will not refresh a bad agency name that was already saved, unless
  `--overwrite` is passed and the draft is published. Default fill-empty remains
  the usual path.
* Data Guide may 404 or be empty until that page exists. The CTA should still
  be CMS-editable.
* Token mapping: prefer existing `pedp-token-overrides.css` values. Add tokens
  only when no close match exists. Do not put one-off hex in JSX.

## Explicitly not in v1

* Studio CSV upload UI.
* As-you-type search.
* Server-side GROQ search or Algolia.
* Clickable search chips / suggested-term pills (hero may mention terms as
  plain text).
* Accordion that closes other cards.
* Second sub-agency abbrev pill (only Org Abbrev).
* Agency section headers (grouping UI). Showing PEDP Agency for Sorting as its
  own card line.
* Dataset size in the UI or search.
* Parsing year-only or fiscal multi-range Time Period into a single day range.
* Blocking publish on date parse failure.
* Editable page size in Sanity.
* Data Catalog in the primary navigation.
* Designing the Data Guide page.
* Showing raw metadata Description when Summary exists.
* Shipping full Description for every row in the list payload when avoidable.

## Follow-ups (when this ADR is next edited)

* Rename CSV column Agency or Org Abbrev to Org Abbrev.
* What to do with Dataset Size / units.
* Year-only time period display (`1998 - 2024`) vs always day-precision.
* Data Guide page IA and route.

## Confirmation

Requirements were gathered against Figma catalog comps (including annotated
expanded-card behavior) and:

* `Dataset Field Index - Sample Combined.csv`
* `Dataset Field Index - Dataset Import.csv`

After implementation, a short manual test plan belongs with the PR or in
[`docs/ops/data-catalog-limited-set-test.md`](../ops/data-catalog-limited-set-test.md)
(sample set only). Editor and import how-tos belong in `docs/content-managers.md`
and `docs/ops/data-catalog-import.md`, not as a second source of truth for these
field rules.

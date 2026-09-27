# Data Catalog CSV fields

Inventory of columns in
`apps/studio/scripts/metadata_final_datacatalogue_20260821.csv` versus
`apps/studio/scripts/import-catalog-datasets.ts` and the Sanity
`catalogDataset` document.

CSV header names must match the script exactly (after trim of leading and
trailing spaces). Spaces inside the name, including around `/`, are part of
the name. `Dataset/Tool Name` is not the same as `Dataset / Tool Name`.

For future imports, start from that existing catalog CSV (copy it, then add or
edit rows). Do not start from a fresh spreadsheet export unless you first make
its headers identical to this file. That keeps names unique and aligned with
the script.

How to run import: [`data-catalog-import.md`](./data-catalog-import.md).
Product rules: [`decisions/0011-data-catalog.md`](../decisions/0011-data-catalog.md).

## Columns the script reads (stored in Sanity)

| Col | CSV header | Sanity field | Used In Search? | Notes |
| --- | --- | --- | --- | --- |
| B | `Dataset/Tool Name` | `datasetTitle` | Yes | Used if `Dataset Title` is absent. Public title still prefers Archived Title. |
| C | `Agency or Org Abbrev` | `orgAbbrev` | Yes | Alias for `Org Abbrev`. Pill on the card. |
| D | `Agency` | `agency` | Yes | Shown on the card. Used for Agency sort. |
| E | `Sub-Agency/Org` | `subAgency` | Yes | |
| F | `Original Location (URL)` | `originalUrl` | No | First URL wins; `Original URL` (AB) is the fallback. |
| M | `Backup Location (URL)` | `backupUrl` | No | Also derives `backupHost` and `backupIsFile`. Part of the import key if DOI is missing. |
| O | `PEDP Metadata Doc` | `metadataDocUrl` | No | First URL in the cell. |
| P | `Dataset Size` | `datasetSize` | No | Stored. Not shown on the public catalog. |
| Q | `Dataset Size_Units (MB,GB,TB, etc.)` | `datasetSizeUnits` | No | Stored. Not shown on the public catalog. |
| V | `Dataset/Tool Name Backup` | `datasetTitle` | Yes | Used only if B (and `Dataset Title`) are empty. |
| X | `Archived Title` | `archivedTitle` | Yes | Preferred public title. |
| Y | `Keywords` | `keywords` | Yes | |
| Z | `CCH Terms` | `cchTerms` | Yes | Search only. |
| AA | `Subject` | `subject` | Yes | Search only. |
| AB | `Original URL` | `originalUrl` | No | Used if F has no URL. |
| AC | `Date Downloaded` | `downloadDateRaw`, `downloadDate`, `downloadDateNeedsReview` | No | Alias `Capture / Download Date` is not in this file. |
| AE | `Description` | `description` | Yes | Card body only when Summary is empty. Searched in that same case. |
| AH | `Notes` | `archiveNotes` | Yes | |
| AJ | `Deposit Digital Identifier` | `depositId`, `importKey` | Yes | `depositId` is searched. Normalized DOI is the unique key. |
| AM | `Time Period / Temporal Resolution` | `timePeriodRaw`, `timePeriodStart`, `timePeriodEnd`, `timePeriodNeedsReview` | Yes | Parsed dates shown on the card are searched. The raw imported string is not. |

This file has no `Summary` column. `summary` stays empty unless editors fill it
in Studio, and that Studio text is included in search. `--overwrite` will not
clear an existing Summary when the column is absent.

This file has no `Capture / Download Date`, `Dataset Title`, or `Org Abbrev`
headers. Those are script aliases for AC, B, and C.

## Columns not read by the script

These exist in the CSV and are ignored. They are not Sanity fields.

| Col | CSV header |
| --- | --- |
| A | `PEDP Agency for Sorting` |
| G | `Downloading Entity` |
| H | `Responsible Contact` |
| I | `Row Updated/Reviewed Last` |
| J | `Status Archiving` |
| K | `Tags ` (trailing space) |
| L | `Existing Backup?` |
| N | `File Type` |
| R | `Date Downloaded backup` |
| S | `Internal Notes` |
| T | `ObjectID` |
| U | `Source File` |
| W | `Subtitle` |
| AD | `Alternate (Source) Identifier` |
| AF | `README file?` |
| AG | `Separate data dictionary?` |
| AI | `Original Author / Agency` |
| AK | `Depositor` |
| AL | `Deposit Date` |
| AN | `Is Your Data Geospatial?` |
| AO | `Spatial Reference System` |
| AP | `Spatial File Format(s)` |
| AQ | `Spatial File Features` |
| AR | `Documentation and Access to Sources` |
| AS | `Source Dataset Disclaimer` |
| AT | `Data User Support` |
| AU | `Dataset Size Backup` |
| AV | `Change Log` |

## Sanity fields with no CSV column

| Sanity field | Source |
| --- | --- |
| `importKey` | Derived from DOI, else backup URL |
| `backupHost`, `backupIsFile` | Derived from backup URL |
| `summary` | Studio (CSV column optional; not in this file) |
| `mentionedIn` | Studio only. Import never writes it. |

Parsed date fields (`timePeriodStart` / `timePeriodEnd` / `downloadDate` and
the `needsReview` flags) come from the raw CSV strings above, not from extra
columns.

## Notes

- Import creates drafts. Public `/data-catalog` lists published documents only.
- Display title is Archived Title, else Dataset/Tool Name (`datasetTitle`).
- `datasets_sans_metadata_20260826.csv` uses the same headers. Metadata,
  description, dates, and DOI are empty on that file.
- Do not put the full catalog CSV in `apps/web`. The site reads Sanity, not the
  spreadsheet.

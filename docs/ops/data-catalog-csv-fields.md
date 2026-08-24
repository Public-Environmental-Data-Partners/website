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

| Col | CSV header | Sanity field | Notes |
| --- | --- | --- | --- |
| A | `PEDP Agency for Sorting` | `pedpAgencyForSorting` | Sort and search. Not a visible card line. |
| B | `Dataset/Tool Name` | `datasetTitle` | Used if `Dataset Title` is absent. Public title still prefers Archived Title. |
| C | `Agency or Org Abbrev` | `orgAbbrev` | Alias for `Org Abbrev`. Pill on the card. |
| D | `Agency` | `agency` | |
| E | `Sub-Agency/Org` | `subAgency` | |
| F | `Original Location (URL)` | `originalUrl` | First URL wins; `Original URL` (AB) is the fallback. |
| M | `Backup Location (URL)` | `backupUrl` | Also derives `backupHost` and `backupIsFile`. Part of the import key if DOI is missing. |
| O | `PEDP Metadata Doc` | `metadataDocUrl` | First URL in the cell. |
| P | `Dataset Size` | `datasetSize` | Stored. Not shown or searched on the public catalog. |
| Q | `Dataset Size_Units (MB,GB,TB, etc.)` | `datasetSizeUnits` | Stored. Not shown or searched on the public catalog. |
| V | `Dataset/Tool Name Backup` | `datasetTitle` | Used only if B (and `Dataset Title`) are empty. |
| X | `Archived Title` | `archivedTitle` | Preferred public title. |
| Y | `Keywords` | `keywords` | |
| Z | `CCH Terms` | `cchTerms` | Search only. |
| AA | `Subject` | `subject` | Search only. |
| AB | `Original URL` | `originalUrl` | Used if F has no URL. |
| AC | `Date Downloaded` | `downloadDateRaw`, `downloadDate`, `downloadDateNeedsReview` | Alias `Capture / Download Date` is not in this file. |
| AE | `Description` | `description` | Card body only when Summary is empty. |
| AH | `Notes` | `archiveNotes` | |
| AJ | `Deposit Digital Identifier` | `depositId`, `importKey` | Normalized DOI is the unique key. |
| AM | `Time Period / Temporal Resolution` | `timePeriodRaw`, `timePeriodStart`, `timePeriodEnd`, `timePeriodNeedsReview` | |

This file has no `Summary` column. `summary` stays empty unless editors fill it
in Studio. `--overwrite` will not clear an existing Summary when the column is
absent.

This file has no `Capture / Download Date`, `Dataset Title`, or `Org Abbrev`
headers. Those are script aliases for AC, B, and C.

## Columns not read by the script

These exist in the CSV and are ignored. They are not Sanity fields.

| Col | CSV header |
| --- | --- |
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
- Do not put the full catalog CSV in `apps/web`. The site reads Sanity, not the
  spreadsheet.

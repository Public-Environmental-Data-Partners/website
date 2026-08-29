# Data Catalog CSV import

Runbook for `apps/studio/scripts/import-catalog-datasets.ts`. Product rules
(unique key, empty-field merge, Summary vs Description, backup host) live in
[`docs/decisions/0011-data-catalog.md`](../decisions/0011-data-catalog.md).
Editors publish and edit in Studio; see
[`docs/content-managers.md`](../content-managers.md) (Data Catalog).
Limited-set QA:
[`docs/ops/data-catalog-limited-set-test.md`](./data-catalog-limited-set-test.md).
CSV column inventory (which headers the script and Sanity use):
[`docs/ops/data-catalog-csv-fields.md`](./data-catalog-csv-fields.md).

## What the script does

Reads a CSV of archived datasets and writes Sanity `catalogDataset` documents
as drafts (`drafts.catalog.…`). It does not publish. The public `/data-catalog`
page lists published documents only.

Re-import matches rows by import key (normalized DOI, else normalized backup
URL). It looks up the CSV import document id (`catalog.…`) first, then any
`catalogDataset` with that import key, so a dataset created in Studio is updated
instead of duplicated. By default, if Studio already has a non-empty value, the
script leaves it alone. Empty fields are filled from the CSV. Pass `--overwrite`
to replace CSV-mapped fields on a draft of the existing document. The published
document is not patched; editors publish the draft to update the live catalog.
Only columns present in the CSV are written. Empty cells unset those fields,
except Summary: Summary is updated only when the CSV has a non-empty Summary
value. Mentioned in is not in the CSV and is never written. Changing a DOI
creates a new key and does not update the old document.

Rows with neither a DOI nor a backup URL are skipped and printed as `SKIP`.

CSV header names must match the script exactly. For a new import file, copy
`apps/studio/scripts/metadata_final_datacatalogue_20260821.csv` and edit rows
rather than starting from a blank export. Column list:
[`data-catalog-csv-fields.md`](./data-catalog-csv-fields.md).

## Flow

1. Read env files if present, then parse the CSV (header row plus data rows).
2. Map each row to catalog fields. Derive backup host and file-vs-page from the
   backup URL. Parse dates when possible.
3. Build the import key (normalized DOI, else backup URL). Skip the row if both
   are missing.
4. `--dry-run` logs the intended `catalog.…` draft id and stops. Otherwise look
   up an existing document by that id, then by import key (covers datasets
   created in Studio). Create a draft, or patch the existing document: empty
   fields only, or CSV-mapped fields on a draft when `--overwrite` is set.
   Always dry-run overwrite before a real write.
5. Editors publish in Studio. The public catalog does not include drafts.

## Command

From the repo root (after `pnpm install`):

```bash
pnpm --filter pedp-studio run import-catalog -- --dry-run
```

Dry-run parses the CSV and logs intended draft ids. It does not write.

Real import:

```bash
SANITY_API_WRITE_TOKEN='…' pnpm --filter pedp-studio run import-catalog
```

Optional path (default is
`apps/studio/scripts/fixtures/sample-combined.csv`). `pnpm --filter` runs in
`apps/studio`, so a relative path may be from the repo root or from that
package. This also works:

```bash
pnpm --filter pedp-studio run import-catalog -- --dry-run scripts/metadata_final_datacatalogue_20260821.csv
```

Overwrite CSV-mapped fields on documents that already exist (dry-run first):

```bash
pnpm --filter pedp-studio run import-catalog -- --dry-run --overwrite /path/to/export.csv
SANITY_API_WRITE_TOKEN='…' pnpm --filter pedp-studio run import-catalog -- --overwrite /path/to/export.csv
```

`--overwrite` writes a draft (`drafts.{id}`). If only a published document
exists, it copies that document to a draft first, then patches the draft. It
does not change the live catalog until someone publishes. It does not delete
documents. New rows still create drafts. Always run `--dry-run --overwrite`
before a real overwrite. A changed DOI is a new dataset, not an update of the
old one.

Equivalent from `apps/studio`:

```bash
SANITY_API_WRITE_TOKEN='…' npx tsx scripts/import-catalog-datasets.ts [--dry-run] [--overwrite] [path/to.csv]
```

## Environment

Needs:

* `SANITY_STUDIO_PROJECT_ID` or `NEXT_PUBLIC_SANITY_PROJECT_ID`
* `SANITY_STUDIO_DATASET` or `NEXT_PUBLIC_SANITY_DATASET`
* `SANITY_API_WRITE_TOKEN` for a real write (not required for `--dry-run`)

The script loads `apps/studio/.env` and `apps/web/.env.local` if present. The
write token must not be a `NEXT_PUBLIC_*` value. Do not commit tokens or paste
them in public channels.

The token needs create and patch on `catalogDataset` documents (including
drafts).

## After import

Tell editors that new rows are drafts. They publish in Studio (individually or
with a bulk publish). Default import will not unpublish or overwrite filled
Summary, agency names, or other non-empty Studio fields. `--overwrite` updates
a draft with CSV columns that are present; it will not clear Summary unless the
CSV has a Summary value, and it will not patch published documents.

Backup host and “backup is a file” are derived from the backup URL during
import. See Field behavior in the ADR for Open in vs Download.

## Logs

Typical lines: `CREATE`, `DRAFT` (published copied to a draft before
overwrite), `PATCH` (with field names), `OVERWRITE` (with set and unset field
names), `NOOP`, `SKIP`, then
`done created=… updated=… skipped=…`. Treat `SKIP` as a review list for missing
DOI and backup URL.

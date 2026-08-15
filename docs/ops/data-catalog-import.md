# Data Catalog CSV import

Runbook for `apps/studio/scripts/import-catalog-datasets.ts`. Product rules
(unique key, empty-field merge, Summary vs Description, backup host) live in
[`docs/decisions/0011-data-catalog.md`](../decisions/0011-data-catalog.md).
Editors publish and edit in Studio; see
[`docs/content-managers.md`](../content-managers.md) (Data Catalog).
Limited-set QA:
[`docs/ops/data-catalog-limited-set-test.md`](./data-catalog-limited-set-test.md).

## What the script does

Reads a CSV of archived datasets and writes Sanity `catalogDataset` documents
as drafts (`drafts.catalog.…`). It does not publish. The public `/data-catalog`
page lists published documents only.

Re-import matches rows by import key (normalized DOI, else normalized backup
URL). For each field, if Studio already has a non-empty value, the script
leaves it alone. Empty fields are filled from the CSV. Mentioned in is not in
the CSV and is never overwritten by import.

Rows with neither a DOI nor a backup URL are skipped and printed as `SKIP`.

## Flow

1. Read env files if present, then parse the CSV (header row plus data rows).
2. Map each row to catalog fields. Derive backup host and file-vs-page from the
   backup URL. Parse dates when possible.
3. Build the import key (normalized DOI, else backup URL). Skip the row if both
   are missing.
4. `--dry-run` logs the draft id and stops. Otherwise create a draft, or patch
   only fields that are still empty on the existing document.
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
`apps/studio/scripts/fixtures/sample-combined.csv`):

```bash
SANITY_API_WRITE_TOKEN='…' pnpm --filter pedp-studio run import-catalog -- /path/to/export.csv
```

Equivalent from `apps/studio`:

```bash
SANITY_API_WRITE_TOKEN='…' npx tsx scripts/import-catalog-datasets.ts [--dry-run] [path/to.csv]
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
with a bulk publish). Import will not unpublish or overwrite filled Summary,
agency names, or other non-empty Studio fields.

Backup host and “backup is a file” are derived from the backup URL during
import. See Field behavior in the ADR for Open in vs Download.

## Logs

Typical lines: `CREATE`, `PATCH` (with field names), `NOOP`, `SKIP`, then
`done created=… updated=… skipped=…`. Treat `SKIP` as a review list for missing
DOI and backup URL.

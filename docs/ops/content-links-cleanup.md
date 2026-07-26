# Content-link cleanup

Temporary runbook for removing the final legacy Portable Text link fallback.
Delete this document when the cleanup is complete.

## Current state

The shared `contentLink` model supports Internal, External, and Email links.
CTA fields and current Portable Text editors use that model.

`resolvePortableTextLink` still accepts legacy marks containing only `href`.
Removing that fallback before content is clean would silently render linked text
without a link.

## Removal gate

1. Confirm editors have re-saved legacy rich-text links.
2. Audit every active dataset, including published documents and drafts.
3. Require zero Portable Text marks that have `href` without `linkType`.
4. Remove `href` from `PortableTextLinkValue` and the fallback branch in
   `resolvePortableTextLink`.
5. Remove the compatibility comment from `ContentLinkMark`.
6. Optionally remove the `contentLinkAnnotation` compatibility re-export from
   `articlePortableText.ts`.
7. Run typecheck, lint, build, and link regression checks.

Inventory queries live in
`apps/studio/migrations/inventory-content-links.groq.md`. Use query **2b** (or
the **2c** count) — marks with `href` and no `linkType` — before treating a
zero result as proof. The broader `href` query alone is not enough.

Keep the inventory queries after cleanup as a standing audit for future imports.

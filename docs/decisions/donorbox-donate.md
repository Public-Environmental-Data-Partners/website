# Donorbox donate page

## Decision

Ship `/donate` as a CMS `sitePage` (slug `donate`) with:

1. **Donate form** — Donorbox donation form iframe (campaign slug from Studio)
2. **Donate info** — custom light-green box (heading, body, prompt, SVG icon rows)
3. **Donor wall** — Donorbox public Donor Wall iframe inside our dark band

## Why Donor Wall (not the donations API) for v1

The Donorbox REST API (`GET /api/v1/donations`) returns all donations and does
not expose each donor’s public-display opt-in. The Donor Wall embed only shows
donors who opted into public comments, so it respects consent without storing
PII or API keys on our servers.

Tradeoff: wall item chrome is Donorbox-hosted and will not match a custom Embla
carousel from the Figma mock.

## Future option

A styled carousel fed by the API (or Sanity-curated quotes) can replace the wall
embed inside `DonorWallSection` without changing the rest of the page. That path
needs an explicit consent/opt-in story before going live.

## CSP

`apps/web/next.config.ts` sets `frame-src` to allow `donorbox.org`. If a fuller
site CSP is added later, keep Donorbox in `frame-src` and `script-src`
(`widget.js`).

## Editor setup

1. Create a Site page titled Donate, slug `donate`.
2. Add sections in order: Donate form → Donate info → Donor wall.
3. Paste the Donorbox campaign slug (or embed URL) into both form and wall fields.
4. Upload the three SVG icons and enter copy from the design.

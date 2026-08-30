# Web CSS architecture

Current ownership and maintenance rules for CSS in `apps/web`.

## Import and token pipeline

`apps/web/src/app/layout.tsx` owns the global CSS import order. Preserve it:

1. `globals.css` — Tailwind, shadcn layers, `@theme` bridges, layout geometry
2. Feature stylesheets — article, hub, and other scoped CSS
3. `pedp-token-overrides.css` — PEDP brand hex and semantic token values (last)

| Concern | Owner |
| --- | --- |
| Tailwind entry, `@theme` bridges, global geometry | `globals.css` |
| PEDP brand color and typography values | `pedp-token-overrides.css` |
| Scoped feature styles | `article-*.css`, `news-hub.css`, `similar-posts.css`, `return-to-top-strip.css`, and future peers |
| Reusable layout geometry | `components/layout` + geometry variables in `globals.css` |
| Component-specific chrome | Tailwind utilities on the component, or a focused feature CSS file |

Brand hex belongs in `pedp-token-overrides.css`. `@theme inline` in `globals.css`
only maps Tailwind utilities to CSS variables. Do not duplicate exact brand hex
values in components — use semantic Tailwind classes or CSS variables.

## Styling policy

Use Tailwind utilities when a rule is local, readable, and composed from
existing tokens. Use a feature CSS file when:

- selectors target rendered Portable Text or third-party markup
- responsive styling is substantially clearer as grouped CSS
- pseudo-elements or complex state selectors dominate
- the styles form a reusable visual subsystem

Global element selectors should be rare. Scope editorial typography and feature
styles with a data attribute or feature class.

## Interactive cursor and hover

`globals.css` `@layer base` sets `cursor: pointer` on `a[href]`, enabled
`button`s, and `[role=button]`. Disabled controls use `not-allowed`. Native
text inputs keep the I-beam.

`Button` also sets `cursor-pointer` so `asChild` links and native submits match.
Do not add one-off `cursor: pointer` in feature CSS.

Filled marketing CTAs use `Button` (`size="cta"` plus a color variant). Donate
goes through `DonateLink` → `Button variant="lightGreen"`. News hub Read More
and Load More use `Button variant="surface"`.

Body-copy links use `contentLinkClass` / `contentLinkMark()` (underline plus
`hover:opacity-80`). Header and footer nav keep underline-on-hover because they
are not always underlined. Do not put `contentLinkClass` on a `Button` CTA.

## Layout boundary

Shell width, grid columns, shared gutters, and reusable responsive geometry are
defined by [`layout-system.md`](./layout-system.md). Feature CSS should not
reimplement the site shell or copy full-bleed calculations.

## Dark mode

The site is light-only until design finishes
[`../design/dark-mode-color-tokens.md`](../design/dark-mode-color-tokens.md).
Token overrides live on `:root` only. Nothing adds `.dark` on `<html>`, and
`color-scheme: light` keeps native UI on the light palette even when the OS
prefers dark.

Long-term intent is still light and dark from OS preference
([`../decisions/0004-light-dark-mode-switching.md`](../decisions/0004-light-dark-mode-switching.md)).
A user-controlled toggle remains deferred
([`../decisions/0006-theme-toggle.md`](../decisions/0006-theme-toggle.md)).

## Maintenance checklist

- Preserve CSS import order (`globals` → features → token overrides).
- Update all token paths when changing a brand value.
- Prefer semantic variables over raw values.
- Keep feature styles scoped.
- Check mobile, tablet, desktop, and reduced motion.
- Remove obsolete feature CSS when its component is deleted.

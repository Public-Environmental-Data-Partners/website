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

## Layout boundary

Shell width, grid columns, shared gutters, and reusable responsive geometry are
defined by [`layout-system.md`](./layout-system.md). Feature CSS should not
reimplement the site shell or copy full-bleed calculations.

## Dark mode

Brand tokens currently provide light values plus dark values under both
`prefers-color-scheme` and `.dark`. Keep those paths synchronized until the
manual-theme decision in
[`../decisions/theme-toggle.md`](../decisions/theme-toggle.md) is resolved.

## Maintenance checklist

- Preserve CSS import order (`globals` → features → token overrides).
- Update all token paths when changing a brand value.
- Prefer semantic variables over raw values.
- Keep feature styles scoped.
- Check mobile, tablet, desktop, dark mode, and reduced motion.
- Remove obsolete feature CSS when its component is deleted.

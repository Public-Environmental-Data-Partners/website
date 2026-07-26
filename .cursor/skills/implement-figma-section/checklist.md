# Figma section discovery checklist

Copy into the agent’s working notes and clear items as they are resolved.

## Scope

- [ ] Page vs reusable section vs article body block
- [ ] New route, existing `sitePage` section, homepage `sections[]`, or article body
- [ ] CMS-managed vs hardcoded chrome
- [ ] Desktop / tablet / mobile comps present (or which to infer)

## Typography (request if missing)

- [ ] User provided type specs or Figma Dev Mode text styles
- [ ] Roles mapped: page title / section heading / heading / prompt / eyebrow
- [ ] Size, weight, line-height, tracking per breakpoint
- [ ] Font role matches loaded site fonts (Figtree, Source Serif 4, Geist Mono)

## Color (request if missing)

- [ ] User provided fill/stroke/text colors or Figma variables
- [ ] Each color mapped to `pedp-token-overrides.css` / Tailwind semantic class
- [ ] Decision recorded for any new token vs nearest existing token
- [ ] Dark-mode implication checked if the surface uses brand tokens

## Layout

- [ ] Shell: `SiteShell` + padding mode
- [ ] Grid spans / stacking / order at `md` and `lg`
- [ ] Full-bleed vs contained band
- [ ] Vertical rhythm vs neighboring sections

## Content model

- [ ] Field names follow `docs/content-terminology.md`
- [ ] Required vs optional fields
- [ ] Portable Text vs plain string
- [ ] Image: ratio, min width, alt, credit, hotspot
- [ ] Lists / cards / repeatable items and empty states

## Links and CTAs

- [ ] Internal / external / email via `contentLink`
- [ ] Button label + empty-link behavior
- [ ] New-tab / external icon expectations

## Motion and a11y

- [ ] Decorative vs informative imagery
- [ ] Heading outline (one `h1` per page)
- [ ] Focus states, keyboard order
- [ ] Reduced-motion alternative

## Images (request if missing)

- [ ] User confirmed photo vs placeholder vs decorative SVG
- [ ] Aspect ratio(s) per breakpoint (or single ratio)
- [ ] Crop / hotspot / object-position
- [ ] Min upload width and export dimensions
- [ ] CMS image field vs `apps/web/public` static asset
- [ ] Alt text ownership (editor-required vs decorative empty alt)
- [ ] Photo credit and caption (fields + placement)
- [ ] Linked image vs separate CTA
- [ ] Responsive `sizes` / priority for LCP candidates

## Other assets

- [ ] Icon source (Lucide vs custom SVG)
- [ ] Non-image brand files under `apps/web/public`

# Layout system

Current v2 layout rules for `apps/web`. New work should use these shared
primitives rather than recreating shell, grid, or bleed calculations inside
feature components.

## Core geometry

- Maximum site width: 1400px.
- Grid: 12 equal columns with a 24px gutter.
- Viewport padding is owned by `SiteShell` and global geometry tokens.
- Mobile and tablet retain an outer inset; desktop uses the full grid when the
  shell reaches its maximum width.

The canonical CSS values live in `apps/web/src/app/globals.css`. Use the
existing variables rather than copying their numeric values.

## Primitives

| Primitive      | Responsibility                                                 |
| -------------- | -------------------------------------------------------------- |
| `SiteShell`    | Site max width and horizontal viewport padding                 |
| `Grid12`       | Twelve-column grid and shared gutter                           |
| `SectionBand`  | Full-width section surface and vertical band boundary          |
| `ContentStack` | Standard vertical rhythm between a section heading and content |

`SiteShell padding="grid"` aligns content directly to the v2 grid. Feature
components may add vertical padding, background, and content styling, but should
not redefine the site width.

## Layout versus component styling

Layout code owns:

- shell width and viewport inset
- column spans and starts
- grid gaps
- full-width section boundaries
- responsive reflow and ordering

Component code owns:

- typography and content hierarchy
- colors, borders, and decorative treatment
- image aspect ratios
- control sizing and interaction states

If multiple sections need the same geometry, add or extend a layout primitive.
If a rule is unique to a section’s visual identity, keep it with that section.

## Responsive rules

- Start with the smallest viable layout and add wider arrangements only when
  content needs them.
- Prefer intrinsic sizing, `minmax`, and wrapping over viewport-specific
  one-off calculations.
- Keep source order meaningful; CSS reordering must not produce an inaccessible
  reading or focus order.
- Use the existing `md` and `lg` transitions consistently with neighboring
  components.

## Adding a section

1. Identify the section’s surface (`SectionBand`).
2. Choose the standard shell (`SiteShell`).
3. Place major regions on `Grid12`.
4. Define spans and responsive order in the component.
5. Keep visual chrome with the component.
6. Compare at mobile, tablet, and desktop widths.

Avoid creating a new prototype or layout abstraction unless the geometry is
reused by more than one real component.

## Current migration note

Some older components and comments may still contain 1440px-era or bespoke
bleed assumptions. Treat this document and the current primitives as the source
of truth; migrate legacy geometry when that component is next changed rather
than preserving the v1 pattern.

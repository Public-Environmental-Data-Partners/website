# Responsive UI guidance

Practical defaults for deciding how UI responds to available space,
typography, motion preferences, and media.

## Layout

- Prefer intrinsic constraints over fixed breakpoint snapshots.
- Use Grid patterns such as `minmax()` and `auto-fit` when the content can
  reflow naturally.
- Add media queries when the component’s content or interaction model genuinely
  changes.
- Keep responsive behavior local to the component unless it is a shared shell
  or grid rule.
- Test narrow, intermediate, and wide widths—not only named breakpoints.

Shared geometry belongs in
[`layout-system.md`](./layout-system.md).

## Typography

- Define a complete font stack for every role; browser fallback happens per
  glyph, not as a single all-or-nothing choice.
- Keep editorial article typography scoped to article prose.
- Avoid fixed-height text containers unless overflow is intentional.
- Recheck wrapping after font, weight, tracking, or content changes.

Brand type and color values are owned by
`apps/web/src/app/pedp-token-overrides.css`.

## Images

- Give images an intentional display aspect ratio to prevent layout shifts.
- Request appropriately sized Sanity CDN images rather than relying only on CSS
  scaling.
- Preserve hotspot/crop data for editor-controlled focal points.
- Use accurate `sizes` values for responsive images.
- Keep alt text requirements in the CMS schema for meaningful images.

## Motion and interaction

- Respect `prefers-reduced-motion`.
- Reduced motion must preserve access to content; replace motion with a static
  or scrollable presentation where needed.
- Keep focus order aligned with reading order.
- Ensure controls remain usable with keyboard, touch, zoom, and long labels.

## Review checklist

- No unexpected horizontal overflow.
- Content remains readable at 200% zoom.
- Text wrapping is acceptable at intermediate widths.
- Images have stable dimensions and correct crops.
- Reduced-motion behavior is usable.
- Touch targets and focus states remain visible.

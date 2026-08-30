import {donateNav, type MainNavEntry, type NavLeaf} from '@/config/nav'
import {type FooterItem, type SiteFooterData} from '@/lib/site-footer'

function normalizeHref(href: string): string {
  const trimmed = href.trim()
  const withSlash = trimmed.startsWith('/') ? trimmed : `/${trimmed}`
  if (withSlash.length > 1 && withSlash.endsWith('/')) {
    return withSlash.slice(0, -1)
  }
  return withSlash
}

function normalizeLabel(label: string): string {
  return label.trim().toLowerCase()
}

function toKebabCase(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function collectShownKeys(primaryNav: MainNavEntry[]): {
  hrefs: Set<string>
  groupLabels: Set<string>
} {
  const hrefs = new Set<string>([normalizeHref(donateNav.href)])
  const groupLabels = new Set<string>()

  for (const entry of primaryNav) {
    if (entry.kind === 'link') {
      hrefs.add(normalizeHref(entry.href))
      continue
    }
    groupLabels.add(normalizeLabel(entry.label))
    for (const item of entry.items) {
      hrefs.add(normalizeHref(item.href))
    }
  }

  return {hrefs, groupLabels}
}

function mapLeftoverItem(
  item: FooterItem,
  hrefs: Set<string>,
  groupLabels: Set<string>,
): MainNavEntry | null {
  if (item.kind === 'link') {
    const href = normalizeHref(item.href)
    if (hrefs.has(href)) {
      return null
    }
    hrefs.add(href)
    return {kind: 'link', label: item.label, href: item.href}
  }

  if (groupLabels.has(normalizeLabel(item.label))) {
    return null
  }

  const items: NavLeaf[] = []
  for (const child of item.items) {
    const href = normalizeHref(child.href)
    if (hrefs.has(href)) {
      continue
    }
    hrefs.add(href)
    items.push({label: child.label, href: child.href})
  }
  if (items.length === 0) {
    return null
  }

  groupLabels.add(normalizeLabel(item.label))
  const id = toKebabCase(item.label)
  return {
    kind: 'group',
    id: id ? `footer-${id}` : 'footer-group',
    label: item.label,
    items,
  }
}

/** Footer column items that are not already listed in primary nav (or Donate). */
export function footerItemsNotInPrimaryNav(
  primaryNav: MainNavEntry[],
  footer: SiteFooterData | null,
): MainNavEntry[] {
  if (!footer) {
    return []
  }

  const {hrefs, groupLabels} = collectShownKeys(primaryNav)
  const out: MainNavEntry[] = []

  for (const item of [...footer.column1Items, ...footer.column2Items]) {
    const mapped = mapLeftoverItem(item, hrefs, groupLabels)
    if (mapped) {
      out.push(mapped)
    }
  }

  return out
}

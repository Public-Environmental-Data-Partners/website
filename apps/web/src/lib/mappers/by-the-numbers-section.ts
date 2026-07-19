import type {PortableTextBlock} from '@portabletext/react'

export const BY_THE_NUMBERS_ICONS = ['dataDb', 'members', 'projects'] as const

export type ByTheNumbersIconId = (typeof BY_THE_NUMBERS_ICONS)[number]

/** Public SVG paths for By the Numbers icons (`brand/coalition`). */
export const BY_THE_NUMBERS_ICON_SRC: Record<ByTheNumbersIconId, string> = {
  dataDb: '/brand/coalition/data-db.svg',
  members: '/brand/coalition/members.svg',
  projects: '/brand/coalition/project.svg',
}

export type ByTheNumbersStatProps = {
  keyId: string
  icon: ByTheNumbersIconId
  value: string
  label: string
  body: PortableTextBlock[]
  ctaLabel?: string
  /** Resolved href; omit when link is empty. */
  href?: string
  external?: boolean
}

export type ByTheNumbersSectionProps = {
  kicker: string
  stats: ByTheNumbersStatProps[]
}

export type ByTheNumbersStatFields = {
  _key?: string | null
  icon?: string | null
  value?: string | null
  label?: string | null
  body?: unknown
  ctaLabel?: string | null
  ctaLinkType?: string | null
  ctaPage?: {slug?: {current?: string | null} | null} | null
  ctaExternalUrl?: string | null
}

export type ByTheNumbersSectionFields = {
  kicker?: string | null
  stats?: ByTheNumbersStatFields[] | null
}

function isByTheNumbersIcon(value: string): value is ByTheNumbersIconId {
  return (BY_THE_NUMBERS_ICONS as readonly string[]).includes(value)
}

function toPortableTextBlocks(value: unknown): PortableTextBlock[] {
  return Array.isArray(value) ? (value as PortableTextBlock[]) : []
}

function normalizeInternalPath(path: string): string {
  const p = path.trim()
  if (!p) {
    return ''
  }
  return p.startsWith('/') ? p : `/${p}`
}

function mapStat(item: ByTheNumbersStatFields, index: number): ByTheNumbersStatProps | null {
  const value = item.value?.trim()
  const label = item.label?.trim()
  const icon = typeof item.icon === 'string' ? item.icon.trim() : ''
  const body = toPortableTextBlocks(item.body)
  if (!value || !label || !isByTheNumbersIcon(icon) || body.length === 0) {
    return null
  }

  const ctaLabel = item.ctaLabel?.trim() || undefined
  const linkType = item.ctaLinkType === 'external' ? 'external' : 'internal'

  let href: string | undefined
  let external = false
  if (linkType === 'external') {
    const url = item.ctaExternalUrl?.trim()
    if (url) {
      href = url
      external = true
    }
  } else {
    const slug = item.ctaPage?.slug?.current?.trim()
    if (slug) {
      href = normalizeInternalPath(slug)
    }
  }

  return {
    keyId: item._key?.trim() || `by-the-numbers-${index}`,
    icon,
    value,
    label,
    body,
    ctaLabel: href ? ctaLabel || 'Learn More' : undefined,
    href,
    external: href ? external : undefined,
  }
}

export function mapByTheNumbersSectionToProps(
  data: ByTheNumbersSectionFields | null | undefined,
): ByTheNumbersSectionProps | null {
  const kicker = data?.kicker?.trim()
  if (!kicker) {
    return null
  }

  const rawStats = Array.isArray(data?.stats) ? data.stats : []
  const stats = rawStats
    .map((item, index) => mapStat(item, index))
    .filter((item): item is ByTheNumbersStatProps => item !== null)

  if (stats.length === 0) {
    return null
  }

  return {kicker, stats}
}

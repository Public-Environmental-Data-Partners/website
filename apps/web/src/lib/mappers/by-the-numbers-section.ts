import type {PortableTextBlock} from '@portabletext/react'

import {type ContentLinkGroq, resolveContentLink} from '@/lib/content-link'
import {pickSectionHeadingFromKicker} from '@/lib/mappers/content-field-compat'

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
  sectionHeading: string
  stats: ByTheNumbersStatProps[]
}

export type ByTheNumbersStatFields = {
  _key?: string | null
  icon?: string | null
  value?: string | null
  label?: string | null
  body?: unknown
  ctaLabel?: string | null
  ctaLink?: ContentLinkGroq | null
}

export type ByTheNumbersSectionFields = {
  sectionHeading?: string | null
  /** Legacy section label. */
  kicker?: string | null
  stats?: ByTheNumbersStatFields[] | null
}

function isByTheNumbersIcon(value: string): value is ByTheNumbersIconId {
  return (BY_THE_NUMBERS_ICONS as readonly string[]).includes(value)
}

function toPortableTextBlocks(value: unknown): PortableTextBlock[] {
  return Array.isArray(value) ? (value as PortableTextBlock[]) : []
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
  const resolved = resolveContentLink(item.ctaLink)

  return {
    keyId: item._key?.trim() || `by-the-numbers-${index}`,
    icon,
    value,
    label,
    body,
    ...(resolved
      ? {ctaLabel: ctaLabel || 'Learn More', href: resolved.href, external: resolved.external}
      : {}),
  }
}

export function mapByTheNumbersSectionToProps(
  data: ByTheNumbersSectionFields | null | undefined,
): ByTheNumbersSectionProps | null {
  const sectionHeading = pickSectionHeadingFromKicker(data ?? {})
  if (!sectionHeading) {
    return null
  }

  const rawStats = Array.isArray(data?.stats) ? data.stats : []
  const stats = rawStats
    .map((item, index) => mapStat(item, index))
    .filter((item): item is ByTheNumbersStatProps => item !== null)

  if (stats.length === 0) {
    return null
  }

  return {sectionHeading, stats}
}

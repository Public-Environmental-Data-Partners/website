import type {PortableTextBlock} from '@portabletext/react'

export const WHAT_WE_DO_ICONS = [
  'dataPreservation',
  'toolsDevelopment',
  'advocacy',
] as const

export type WhatWeDoIconId = (typeof WHAT_WE_DO_ICONS)[number]

/** Public SVG paths for What We Do icons. */
export const WHAT_WE_DO_ICON_SRC: Record<WhatWeDoIconId, string> = {
  dataPreservation: '/brand/what-we-do/data-pres.svg',
  toolsDevelopment: '/brand/what-we-do/tools-dev.svg',
  advocacy: '/brand/what-we-do/advo.svg',
}

export type WhatWeDoItemProps = {
  keyId: string
  icon: WhatWeDoIconId
  title: string
  body: PortableTextBlock[]
  ctaLabel: string
  /** Root-relative href; omit when no site page selected. */
  href?: string
}

export type WhatWeDoSectionProps = {
  heading: string
  items: WhatWeDoItemProps[]
}

export type WhatWeDoItemFields = {
  _key?: string | null
  icon?: string | null
  title?: string | null
  body?: unknown
  ctaLabel?: string | null
  ctaPage?: {slug?: {current?: string | null} | null} | null
}

export type WhatWeDoSectionFields = {
  heading?: string | null
  items?: WhatWeDoItemFields[] | null
}

function isWhatWeDoIcon(value: string): value is WhatWeDoIconId {
  return (WHAT_WE_DO_ICONS as readonly string[]).includes(value)
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

function mapItem(item: WhatWeDoItemFields, index: number): WhatWeDoItemProps | null {
  const title = item.title?.trim()
  const icon = typeof item.icon === 'string' ? item.icon.trim() : ''
  const body = toPortableTextBlocks(item.body)
  if (!title || !isWhatWeDoIcon(icon) || body.length === 0) {
    return null
  }

  const ctaLabel = item.ctaLabel?.trim() || 'Learn More'
  const slug = item.ctaPage?.slug?.current?.trim()
  const href = slug ? normalizeInternalPath(slug) : undefined

  return {
    keyId: item._key?.trim() || `what-we-do-${index}`,
    icon,
    title,
    body,
    ctaLabel,
    href,
  }
}

export function mapWhatWeDoSectionToProps(
  data: WhatWeDoSectionFields | null | undefined,
): WhatWeDoSectionProps | null {
  const heading = data?.heading?.trim()
  if (!heading) {
    return null
  }

  const rawItems = Array.isArray(data?.items) ? data.items : []
  const items = rawItems
    .map((item, index) => mapItem(item, index))
    .filter((item): item is WhatWeDoItemProps => item !== null)

  if (items.length === 0) {
    return null
  }

  return {heading, items}
}

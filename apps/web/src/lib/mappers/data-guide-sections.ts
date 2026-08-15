import type {PortableTextBlock} from '@portabletext/react'

function toPortableTextBlocks(value: unknown): PortableTextBlock[] {
  return Array.isArray(value) ? (value as PortableTextBlock[]) : []
}

export type DataGuideHeroFields = {
  body?: unknown
}

export type DataGuideHeroProps = {
  pageTitle: string
  body: PortableTextBlock[]
}

export type DataGuideBodyFields = {
  body?: unknown
}

export type DataGuideBodyProps = {
  body: PortableTextBlock[]
}

export function mapDataGuideHeroToProps(
  data: DataGuideHeroFields | null | undefined,
  pageTitle: string,
): DataGuideHeroProps | null {
  const title = pageTitle.trim()
  const body = toPortableTextBlocks(data?.body)
  if (!title || body.length === 0) {
    return null
  }
  return {pageTitle: title, body}
}

export function mapDataGuideBodyToProps(
  data: DataGuideBodyFields | null | undefined,
): DataGuideBodyProps | null {
  const body = toPortableTextBlocks(data?.body)
  if (body.length === 0) {
    return null
  }
  return {body}
}

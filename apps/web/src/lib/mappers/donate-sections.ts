import type {PortableTextBlock} from '@portabletext/react'

import {resolveDonorboxEmbed} from '@/lib/donorbox'
import type {SanityImageData} from '@/lib/mappers/sanity-image'

export type DonateInfoRow = {
  iconSrc: string
  iconWidth?: number
  iconHeight?: number
  label: string
}

export type DonateFormSectionProps = {
  embedUrl: string
  isPlaceholder: boolean
  body: PortableTextBlock[]
}

export type DonateInfoSectionProps = {
  sectionHeading: string
  body: PortableTextBlock[]
  prompt: string
  rows: DonateInfoRow[]
}

export type DonorWallSectionProps = {
  sectionHeading: string
  embedUrl: string
  isPlaceholder: boolean
  body: PortableTextBlock[]
}

export type DonateFormSectionFields = {
  donorboxCampaign?: string | null
  body?: PortableTextBlock[] | null
}

export type DonateInfoRowFields = {
  icon?: SanityImageData
  label?: string | null
}

export type DonateInfoSectionFields = {
  sectionHeading?: string | null
  body?: PortableTextBlock[] | null
  prompt?: string | null
  rows?: DonateInfoRowFields[] | null
}

export type DonorWallSectionFields = {
  sectionHeading?: string | null
  donorboxCampaign?: string | null
  body?: PortableTextBlock[] | null
}

export function mapDonateFormSectionToProps(
  data: DonateFormSectionFields | null | undefined,
): DonateFormSectionProps | null {
  const body = Array.isArray(data?.body) ? data.body : []
  if (body.length === 0) {
    return null
  }
  const {src, isPlaceholder} = resolveDonorboxEmbed(data?.donorboxCampaign, 'form')
  return {
    embedUrl: src,
    isPlaceholder,
    body,
  }
}

export function mapDonateInfoSectionToProps(
  data: DonateInfoSectionFields | null | undefined,
): DonateInfoSectionProps | null {
  const sectionHeading = data?.sectionHeading?.trim()
  const prompt = data?.prompt?.trim()
  const body = Array.isArray(data?.body) ? data.body : []
  if (!sectionHeading || !prompt || body.length === 0) {
    return null
  }

  const rows = (Array.isArray(data?.rows) ? data.rows : [])
    .map((row): DonateInfoRow | null => {
      const label = row.label?.trim()
      const src = row.icon?.asset?.url?.trim()
      if (!label || !src) {
        return null
      }
      const width = row.icon?.asset?.metadata?.dimensions?.width ?? undefined
      const height = row.icon?.asset?.metadata?.dimensions?.height ?? undefined
      return {
        iconSrc: src,
        ...(typeof width === 'number' ? {iconWidth: width} : {}),
        ...(typeof height === 'number' ? {iconHeight: height} : {}),
        label,
      }
    })
    .filter((row): row is DonateInfoRow => row !== null)

  if (rows.length === 0) {
    return null
  }

  return {sectionHeading, body, prompt, rows}
}

export function mapDonorWallSectionToProps(
  data: DonorWallSectionFields | null | undefined,
): DonorWallSectionProps | null {
  const sectionHeading = data?.sectionHeading?.trim()
  const body = Array.isArray(data?.body) ? data.body : []
  if (!sectionHeading || body.length === 0) {
    return null
  }
  const {src, isPlaceholder} = resolveDonorboxEmbed(data?.donorboxCampaign, 'wall')
  return {
    sectionHeading,
    embedUrl: src,
    isPlaceholder,
    body,
  }
}

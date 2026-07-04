import type {PortableTextBlock} from '@portabletext/react'

import type {ImageTextBlockPosition} from '@/components/content/image-text-block'
import {mapSanityArticleFigureImage} from '@/lib/mappers/article-figure'
import type {SanityImageData} from '@/lib/mappers/sanity-image'

export type ImageTextBlockData = {
  imagePosition?: string | null
  image?: SanityImageData
  photoCredit?: string | null
  body?: PortableTextBlock[] | null
}

export function mapImageTextBlockProps(data: ImageTextBlockData | null | undefined): {
  image: NonNullable<ReturnType<typeof mapSanityArticleFigureImage>>
  photoCredit?: string
  body: PortableTextBlock[]
  imagePosition: ImageTextBlockPosition
} | null {
  if (!data) {
    return null
  }

  const alt = data.image?.alt?.trim() ?? ''
  const image = mapSanityArticleFigureImage(data.image ?? null, 'imageText4', alt)
  const body = Array.isArray(data.body) ? data.body : []
  if (!image || body.length === 0) {
    return null
  }

  const imagePosition: ImageTextBlockPosition = data.imagePosition === 'right' ? 'right' : 'left'
  const photoCredit = data.photoCredit?.trim() || undefined

  return {image, photoCredit, body, imagePosition}
}

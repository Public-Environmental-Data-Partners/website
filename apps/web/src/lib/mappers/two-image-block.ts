import type {PortableTextBlock} from '@portabletext/react'

import type {TwoImageBlockItemProps} from '@/components/content/two-image-block'
import {mapSanityArticleFigureImage} from '@/lib/mappers/article-figure'
import {normalizeFigureCaption} from '@/lib/mappers/image-block'
import type {SanityImageData} from '@/lib/mappers/sanity-image'

export type ArticleFigureItemData = {
  image?: SanityImageData
  photoCredit?: string | null
  caption?: PortableTextBlock[] | string | null
}

export function mapArticleFigureItemToProps(
  item: ArticleFigureItemData | null | undefined,
): TwoImageBlockItemProps | null {
  if (!item) {
    return null
  }

  const alt = item.image?.alt?.trim() ?? ''
  const mapped = mapSanityArticleFigureImage(item.image ?? null, 'duo6', alt)
  if (!mapped) {
    return null
  }

  const photoCredit = item.photoCredit?.trim() || undefined
  const caption = normalizeFigureCaption(item.caption)

  return {
    image: mapped,
    photoCredit,
    caption: caption.length > 0 ? caption : undefined,
  }
}

export function mapTwoImageBlockItems(
  items: ArticleFigureItemData[] | null | undefined,
): TwoImageBlockItemProps[] {
  if (!Array.isArray(items)) {
    return []
  }

  return items
    .map((item) => mapArticleFigureItemToProps(item))
    .filter((item): item is TwoImageBlockItemProps => item !== null)
}

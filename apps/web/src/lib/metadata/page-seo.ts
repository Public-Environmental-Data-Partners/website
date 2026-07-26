import type {Metadata} from 'next'

import {defaultOgImagePath, siteDescription, siteName} from '@/config/site'

export type CmsSeoFields = {
  title?: string | null
  description?: string | null
} | null

export type ShareImage = {
  src: string
  alt: string
  width: number
  height: number
}

export const DEFAULT_OG_IMAGE: ShareImage = {
  src: defaultOgImagePath,
  alt: siteName,
  width: 1200,
  height: 630,
}

export type PageSeoContent = {
  title: string
  description: string
  canonicalPath: string
  shareImage?: ShareImage
  openGraphType?: 'website' | 'article'
  publishedTime?: string
}

/** CMS SEO title, else document/page title. */
export function resolveSeoTitle(seo: CmsSeoFields | undefined, fallbackTitle: string): string {
  return seo?.title?.trim() || fallbackTitle.trim()
}

/** CMS SEO description, else content fallback, else site default. */
export function resolveSeoDescription(
  seo: CmsSeoFields | undefined,
  fallbackDescription?: string | null,
): string {
  return seo?.description?.trim() || fallbackDescription?.trim() || siteDescription
}

export function buildPageMetadata(seo: PageSeoContent): Metadata {
  const {title, description, canonicalPath, publishedTime} = seo
  const shareImage = seo.shareImage ?? DEFAULT_OG_IMAGE
  const ogType = seo.openGraphType ?? 'website'

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      type: ogType,
      title,
      description,
      url: canonicalPath,
      siteName,
      locale: 'en_US',
      images: [
        {
          url: shareImage.src,
          width: shareImage.width,
          height: shareImage.height,
          alt: shareImage.alt,
        },
      ],
      ...(publishedTime ? {publishedTime} : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [shareImage.src],
    },
  }
}

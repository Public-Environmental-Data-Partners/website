import type {Metadata} from 'next'
import {notFound} from 'next/navigation'

import {ArticleBody} from '@/components/content/article-body'
import {ArticleAudioSection} from '@/components/sections/article-audio-section'
import {ArticleHeroSection} from '@/components/sections/article-hero-section'
import {ArticleJsonLd} from '@/components/seo/article-json-ld'
import {siteUrl} from '@/config/site'
import {mapArticleAudioSectionProps} from '@/lib/mappers/article-audio'
import {mapNewsPostToArticleHeroProps} from '@/lib/mappers/news-post'
import {
  buildNewsPostArticleJsonLd,
  buildNewsPostMetadata,
  resolveNewsPostSeoContent,
} from '@/lib/metadata/news-post'
import {getNewsPostBySlug} from '@/lib/queries/news-post-by-slug'

export const dynamic = 'force-dynamic'

type NewsPostPageProps = {
  params: Promise<{slug: string}>
}

export async function generateMetadata({params}: NewsPostPageProps): Promise<Metadata> {
  const {slug} = await params
  const post = await getNewsPostBySlug(slug)
  const seo = resolveNewsPostSeoContent(post)

  if (!seo) {
    return {title: 'Article not found'}
  }

  return buildNewsPostMetadata(seo)
}

export default async function NewsPostPage({params}: NewsPostPageProps) {
  const {slug} = await params
  const post = await getNewsPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const heroProps = mapNewsPostToArticleHeroProps(post)
  if (!heroProps) {
    notFound()
  }

  const seo = resolveNewsPostSeoContent(post)
  const jsonLd = seo ? buildNewsPostArticleJsonLd(seo) : null
  const audioProps = mapArticleAudioSectionProps(post.audio)

  return (
    <>
      {jsonLd ? <ArticleJsonLd data={jsonLd} /> : null}
      <ArticleHeroSection {...heroProps} />
      {audioProps && seo ? (
        <ArticleAudioSection
          {...audioProps}
          shareUrl={new URL(seo.canonicalPath, siteUrl).href}
          shareTitle={seo.title}
        />
      ) : null}
      <ArticleBody body={post.body} />
    </>
  )
}

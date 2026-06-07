import type {Metadata} from 'next'
import {notFound} from 'next/navigation'

import {ArticleBodyStub} from '@/components/news/article-body-stub'
import {ArticleDetailHeroSection} from '@/components/sections/article-detail-hero-section'
import {mapNewsPostToDetailHeroProps} from '@/lib/mappers/news-post'
import {getNewsPostBySlug} from '@/lib/queries/news-post-by-slug'

export const dynamic = 'force-dynamic'

type NewsPostPageProps = {
  params: Promise<{slug: string}>
}

export async function generateMetadata({params}: NewsPostPageProps): Promise<Metadata> {
  const {slug} = await params
  const post = await getNewsPostBySlug(slug)
  const title = post?.title?.trim()

  if (!title) {
    return {title: 'Article not found'}
  }

  return {title}
}

export default async function NewsPostPage({params}: NewsPostPageProps) {
  const {slug} = await params
  const post = await getNewsPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const heroProps = mapNewsPostToDetailHeroProps(post)
  if (!heroProps) {
    notFound()
  }

  return (
    <>
      <ArticleDetailHeroSection {...heroProps} />
      <ArticleBodyStub body={post.body as never} />
    </>
  )
}

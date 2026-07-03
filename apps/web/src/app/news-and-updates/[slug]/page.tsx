import type {Metadata} from 'next'
import {notFound} from 'next/navigation'

import {ArticleBody} from '@/components/content/article-body'
import {BlogHeroSection} from '@/components/sections/blog-hero-section'
import {mapNewsPostToBlogHeroProps} from '@/lib/mappers/news-post'
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

  const heroProps = mapNewsPostToBlogHeroProps(post)
  if (!heroProps) {
    notFound()
  }

  return (
    <>
      <BlogHeroSection {...heroProps} />
      <ArticleBody body={post.body} />
    </>
  )
}

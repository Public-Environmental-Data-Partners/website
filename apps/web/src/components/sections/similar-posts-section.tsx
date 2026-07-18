import {ArrowUp} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import type {HeroImage} from '@/components/hero/hero-image'
import {SiteShell} from '@/components/layout'

export type SimilarPostCardProps = {
  href: string
  title: string
  date: string
  image: HeroImage
  seriesName?: string
}

export type SimilarPostsSectionProps = {
  posts: SimilarPostCardProps[]
}

function imageDimension(value: number | undefined, fallback: number) {
  return typeof value === 'number' && value > 0 ? value : fallback
}

function SimilarPostCard({post, index}: {post: SimilarPostCardProps; index: number}) {
  const titleId = `similar-post-title-${index}`

  return (
    <article data-slot="similar-post-card">
      <Link href={post.href} data-slot="similar-post-link" aria-labelledby={titleId}>
        <span data-slot="similar-post-image">
          <Image
            src={post.image.src}
            alt={post.image.alt}
            width={imageDimension(post.image.width, 680)}
            height={imageDimension(post.image.height, 514)}
            className="h-full w-full object-cover"
            sizes="(max-width: 767px) calc((100vw - 56px) / 2), (max-width: 1023px) 340px, 332px"
          />
        </span>

        <span data-slot="similar-post-content">
          {post.seriesName ? <span data-slot="similar-post-series">{post.seriesName}</span> : null}
          <h3 id={titleId} data-slot="similar-post-title">
            {post.title}
          </h3>
          <time data-slot="similar-post-date">{post.date}</time>
        </span>
      </Link>
    </article>
  )
}

export function SimilarPostsSection({posts}: SimilarPostsSectionProps) {
  if (posts.length === 0) {
    return null
  }

  return (
    <section data-slot="similar-posts" aria-labelledby="similar-posts-heading" className="bg-white">
      <SiteShell padding="grid">
        <div data-slot="similar-posts-grid">
          <h2 id="similar-posts-heading" data-slot="similar-posts-heading">
            Similar Posts:
          </h2>

          <div data-slot="similar-posts-list">
            {posts.map((post, index) => (
              <SimilarPostCard key={`${post.href}-${index}`} post={post} index={index} />
            ))}
          </div>

          <a href="#top" data-slot="return-to-top">
            <ArrowUp aria-hidden />
            <span>Return to top</span>
          </a>
        </div>
      </SiteShell>
    </section>
  )
}

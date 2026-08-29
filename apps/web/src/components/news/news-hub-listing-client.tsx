'use client'

import {useCallback, useState, useSyncExternalStore} from 'react'

import {NewsHubCard, type NewsHubCardProps} from '@/components/news/news-hub-card'
import {Button} from '@/components/ui/button'
import type {NewsHubLoadCounts} from '@/lib/queries/news-hub-page'

type Breakpoint = 'mobile' | 'tablet' | 'desktop'

type NewsHubListingClientProps = {
  initialPosts: NewsHubCardProps[]
  total: number
  initialLoad: NewsHubLoadCounts
  loadMore: NewsHubLoadCounts
}

function getBreakpoint(): Breakpoint {
  if (typeof window === 'undefined') {
    return 'desktop'
  }
  if (window.matchMedia('(min-width: 1024px)').matches) {
    return 'desktop'
  }
  if (window.matchMedia('(min-width: 768px)').matches) {
    return 'tablet'
  }
  return 'mobile'
}

function subscribeBreakpoint(onStoreChange: () => void) {
  if (typeof window === 'undefined') {
    return () => {}
  }
  const mqTablet = window.matchMedia('(min-width: 768px)')
  const mqDesktop = window.matchMedia('(min-width: 1024px)')
  mqTablet.addEventListener('change', onStoreChange)
  mqDesktop.addEventListener('change', onStoreChange)
  return () => {
    mqTablet.removeEventListener('change', onStoreChange)
    mqDesktop.removeEventListener('change', onStoreChange)
  }
}

function countFor(counts: NewsHubLoadCounts, breakpoint: Breakpoint) {
  return counts[breakpoint]
}

export function NewsHubListingClient({
  initialPosts,
  total,
  initialLoad,
  loadMore,
}: NewsHubListingClientProps) {
  const breakpoint = useSyncExternalStore(
    subscribeBreakpoint,
    getBreakpoint,
    (): Breakpoint => 'desktop',
  )
  const [posts, setPosts] = useState(initialPosts)
  /** Extra posts revealed beyond the breakpoint’s initial count (Load More clicks). */
  const [extraCount, setExtraCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const initialCount = countFor(initialLoad, breakpoint)
  const loadMoreCount = countFor(loadMore, breakpoint)
  const displayCount = Math.min(total, posts.length, initialCount + extraCount)
  const hasMore = displayCount < total
  const visiblePosts = posts.slice(0, displayCount)

  const onLoadMore = useCallback(async () => {
    if (loading || displayCount >= total) {
      return
    }

    setLoading(true)
    setError(null)

    const nextExtra = extraCount + loadMoreCount
    const target = Math.min(total, initialCount + nextExtra)

    try {
      let nextPosts = posts
      if (nextPosts.length < target) {
        const limit = Math.min(loadMoreCount, total - nextPosts.length)
        const res = await fetch(`/api/news-posts?offset=${nextPosts.length}&limit=${limit}`)
        if (!res.ok) {
          throw new Error('Failed to load posts')
        }
        const data = (await res.json()) as {posts?: NewsHubCardProps[]}
        nextPosts = [...nextPosts, ...(data.posts ?? [])]
        setPosts(nextPosts)
      }
      setExtraCount(nextExtra)
    } catch {
      setError('Unable to load more posts. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [displayCount, extraCount, initialCount, loadMoreCount, loading, posts, total])

  return (
    <>
      {visiblePosts.length > 0 ? (
        <div data-slot="news-hub-grid">
          {visiblePosts.map((post, index) => (
            <NewsHubCard key={post.titleId ?? post.href} {...post} priority={index === 0} />
          ))}
        </div>
      ) : null}

      {hasMore ? (
        <div data-slot="news-hub-actions">
          <Button
            type="button"
            variant="surface"
            size="cta"
            data-slot="news-hub-load-more"
            onClick={onLoadMore}
            disabled={loading}
          >
            {loading ? 'Loading…' : 'Load More'}
          </Button>
        </div>
      ) : null}

      {error ? (
        <p className="text-center text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
    </>
  )
}

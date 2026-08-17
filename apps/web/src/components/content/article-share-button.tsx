'use client'

import {Share2} from 'lucide-react'
import posthog from 'posthog-js'
import {useCallback, useState} from 'react'

import {cn} from '@/lib/utils'

export type ArticleShareButtonProps = {
  shareUrl: string
  shareTitle: string
  className?: string
}

export function ArticleShareButton({shareUrl, shareTitle, className}: ArticleShareButtonProps) {
  const [statusMessage, setStatusMessage] = useState('')

  const handleShare = useCallback(async () => {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({url: shareUrl, title: shareTitle})
        posthog.capture('article_shared', {share_method: 'native'})
        return
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return
        }
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl)
      setStatusMessage('Link copied to clipboard')
      posthog.capture('article_shared', {share_method: 'clipboard'})
    } catch {
      setStatusMessage('Could not copy link')
    }

    window.setTimeout(() => setStatusMessage(''), 2500)
  }, [shareTitle, shareUrl])

  return (
    <div className={cn('relative', className)}>
      <button
        type="button"
        data-slot="article-audio-share"
        className="article-audio-share"
        aria-label="Share article"
        onClick={() => void handleShare()}
      >
        <Share2 aria-hidden="true" className="article-audio-share-icon" />
      </button>
      <span className="sr-only" aria-live="polite">
        {statusMessage}
      </span>
    </div>
  )
}

'use client'

import {Pause, PlaySquare} from 'lucide-react'
import {useCallback, useId, useRef, useState} from 'react'

import {captureEvent} from '@/lib/analytics'
import {cn} from '@/lib/utils'

export type ArticleListenPillProps = {
  audioSrc: string
  durationMinutes: number
  className?: string
}

export function ArticleListenPill({audioSrc, durationMinutes, className}: ArticleListenPillProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const labelId = useId()

  const togglePlayback = useCallback(async () => {
    const audio = audioRef.current
    if (!audio) {
      return
    }

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
      return
    }

    try {
      // Count a start, not pause/resume. Check before play(); currentTime can
      // advance as soon as playback begins.
      const isStart = audio.currentTime < 0.25
      await audio.play()
      setIsPlaying(true)
      if (isStart) {
        captureEvent('article_audio_started', {duration_minutes: durationMinutes})
      }
    } catch {
      setIsPlaying(false)
    }
  }, [durationMinutes, isPlaying])

  return (
    <>
      <audio
        ref={audioRef}
        src={audioSrc}
        preload="metadata"
        className="sr-only"
        aria-hidden="true"
        onEnded={() => setIsPlaying(false)}
        onPause={() => setIsPlaying(false)}
      />
      <button
        type="button"
        data-slot="article-audio-pill"
        className={cn('article-audio-pill', className)}
        aria-labelledby={labelId}
        aria-pressed={isPlaying}
        onClick={() => void togglePlayback()}
      >
        {isPlaying ? (
          <Pause
            data-slot="article-audio-pill-icon"
            aria-hidden="true"
            className="article-audio-pill-icon"
          />
        ) : (
          <PlaySquare
            data-slot="article-audio-pill-icon"
            aria-hidden="true"
            className="article-audio-pill-icon"
          />
        )}
        <span
          id={labelId}
          data-slot="article-audio-pill-label"
          className="article-audio-pill-label"
        >
          <span className="hidden lg:inline">{`LISTEN: ${durationMinutes} MINS`}</span>
          <span className="lg:hidden">{`${durationMinutes} MINS`}</span>
        </span>
        <span className="sr-only">{`, ${durationMinutes} minutes`}</span>
      </button>
    </>
  )
}

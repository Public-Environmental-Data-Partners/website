'use client'

import {useEffect} from 'react'

import {initPosthog} from '@/lib/analytics'

/** Starts PostHog after hydration so the SDK does not inject scripts into the pre-hydrate DOM. */
export function PostHogInit() {
  useEffect(() => {
    initPosthog()
  }, [])

  return null
}

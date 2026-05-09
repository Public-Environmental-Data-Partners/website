'use client'

import {useSyncExternalStore} from 'react'

function prefersReducedMotionSubscribe(onStoreChange: () => void) {
  if (typeof window === 'undefined') {
    return () => {}
  }
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
  mq.addEventListener('change', onStoreChange)
  return () => mq.removeEventListener('change', onStoreChange)
}

function prefersReducedMotionSnapshot() {
  if (typeof window === 'undefined') {
    return false
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function usePrefersReducedMotion() {
  return useSyncExternalStore(
    prefersReducedMotionSubscribe,
    prefersReducedMotionSnapshot,
    () => false,
  )
}

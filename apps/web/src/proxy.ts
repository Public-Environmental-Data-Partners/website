import type {NextRequest} from 'next/server'
import {NextResponse} from 'next/server'

/** Rolling window for counting POSTs (ms). */
const WINDOW_MS = 60_000
/** Max POSTs per client IP per window (in-memory; approximate under serverless multi-instance). */
const MAX_REQUESTS_PER_WINDOW = 15

/** IP → timestamps of allowed requests in the current sliding window. */
const requestTimestampsByIp = new Map<string, number[]>()

function clientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0]?.trim() || 'unknown'
  }
  const realIp = request.headers.get('x-real-ip')
  if (realIp) {
    return realIp.trim()
  }
  return 'unknown'
}

/** Returns false when this request exceeds the per-IP limit (caller should respond 429). */
function allowNewsletterPost(ip: string): boolean {
  const now = Date.now()
  let stamps = requestTimestampsByIp.get(ip) ?? []
  stamps = stamps.filter((t) => now - t < WINDOW_MS)

  if (stamps.length >= MAX_REQUESTS_PER_WINDOW) {
    requestTimestampsByIp.set(ip, stamps)
    return false
  }

  stamps.push(now)
  requestTimestampsByIp.set(ip, stamps)

  // Best-effort cap on map size (edge isolate memory).
  if (requestTimestampsByIp.size > 10_000) {
    requestTimestampsByIp.clear()
  }

  return true
}

export function proxy(request: NextRequest) {
  if (request.method !== 'POST') {
    return NextResponse.next()
  }

  const ip = clientIp(request)
  if (!allowNewsletterPost(ip)) {
    return NextResponse.json(
      {ok: false, error: 'Too many signup attempts. Please try again in a minute.'},
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil(WINDOW_MS / 1000)),
        },
      },
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/api/newsletter-signup',
}

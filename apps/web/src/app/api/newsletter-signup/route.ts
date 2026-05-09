import {NextResponse} from 'next/server'

import {getSanityWriteClient} from '@/sanity/write-client'

export const runtime = 'nodejs'

const MAX_EMAIL_LEN = 254

/** Pragmatic shape check; storage is plain text, no HTML interpretation. */
function isValidEmailShape(email: string): boolean {
  if (email.length === 0 || email.length > MAX_EMAIL_LEN) {
    return false
  }
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

type Body = {
  email?: unknown
  /** Honeypot: bots often fill this; must stay empty. */
  website?: unknown
}

function honeypotTriggered(value: unknown): boolean {
  if (value == null || value === '') {
    return false
  }
  if (typeof value === 'string') {
    return value.trim() !== ''
  }
  return true
}

export async function POST(request: Request) {
  let body: Body
  try {
    body = (await request.json()) as Body
  } catch {
    return NextResponse.json({ok: false, error: 'Invalid JSON'}, {status: 400})
  }

  if (honeypotTriggered(body.website)) {
    return NextResponse.json({ok: true})
  }

  const rawEmail = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  if (!isValidEmailShape(rawEmail)) {
    return NextResponse.json({ok: false, error: 'Enter a valid email address.'}, {status: 400})
  }

  const client = getSanityWriteClient()
  if (!client) {
    return NextResponse.json(
      {ok: false, error: 'Newsletter signup is not configured.'},
      {status: 503},
    )
  }

  const existingId = await client.fetch<string | null>(
    `*[_type == "newsletterSignup" && lower(email) == $email][0]._id`,
    {email: rawEmail},
  )

  if (!existingId) {
    await client.create({
      _type: 'newsletterSignup',
      email: rawEmail,
      submittedAt: new Date().toISOString(),
    })
  }

  return NextResponse.json({ok: true})
}

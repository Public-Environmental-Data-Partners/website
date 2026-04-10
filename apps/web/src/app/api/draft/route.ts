import {draftMode} from 'next/headers'
import {type NextRequest, NextResponse} from 'next/server'
import {redirect} from 'next/navigation'

/**
 * Enable Next.js Draft Mode after validating a shared secret.
 * Usage: /api/draft?secret=<SANITY_PREVIEW_SECRET>&slug=/
 */
export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')
  const slug = request.nextUrl.searchParams.get('slug') || '/'

  if (!process.env.SANITY_PREVIEW_SECRET) {
    return new NextResponse('Preview secret not configured on server', {
      status: 500,
    })
  }

  if (secret !== process.env.SANITY_PREVIEW_SECRET) {
    return new NextResponse('Invalid token', {status: 401})
  }

  const draft = await draftMode()
  draft.enable()

  const path = slug.startsWith('/') ? slug : `/${slug}`
  redirect(path)
}

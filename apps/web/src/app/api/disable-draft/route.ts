import {draftMode} from 'next/headers'
import {redirect} from 'next/navigation'

/** Exit Draft Mode (clear cookie) and return to the live site. */
export async function GET() {
  const draft = await draftMode()
  draft.disable()
  redirect('/')
}

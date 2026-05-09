import 'server-only'

import {createClient} from 'next-sanity'

/** Server-only client for mutating Sanity (newsletter signups). Requires `SANITY_API_WRITE_TOKEN`. */
export function getSanityWriteClient() {
  const token = process.env.SANITY_API_WRITE_TOKEN
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
  const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION

  if (!token || !projectId || !dataset || !apiVersion) {
    return null
  }

  return createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token,
  })
}

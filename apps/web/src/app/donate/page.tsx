import type {Metadata} from 'next'

import {PlaceholderPageShell} from '@/components/placeholder-page-shell'

export const metadata: Metadata = {
  title: 'Donate',
}

export default function DonatePage() {
  return (
    <PlaceholderPageShell
      title="Donate"
      description="Donation options will be available here soon."
    />
  )
}

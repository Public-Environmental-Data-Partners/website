import type {Metadata} from 'next'

import {PlaceholderPageShell} from '@/components/placeholder-page-shell'

export const metadata: Metadata = {
  title: "What's happening",
}

export default function WhatsHappeningPage() {
  return (
    <PlaceholderPageShell
      title="What's happening"
      description="News and updates will appear here. Check back soon."
    />
  )
}

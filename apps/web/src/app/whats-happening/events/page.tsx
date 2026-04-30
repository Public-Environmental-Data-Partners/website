import type {Metadata} from 'next'

import {PlaceholderPageShell} from '@/components/placeholder-page-shell'

export const metadata: Metadata = {
  title: 'Events',
}

export default function WhatsHappeningEventsPage() {
  return (
    <PlaceholderPageShell
      title="Events"
      description="Upcoming and past events will be listed here. Check back soon."
    />
  )
}

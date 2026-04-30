import type {Metadata} from 'next'

import {PlaceholderPageShell} from '@/components/placeholder-page-shell'

export const metadata: Metadata = {
  title: 'Blog',
}

export default function WhatsHappeningBlogPage() {
  return (
    <PlaceholderPageShell
      title="Blog"
      description="Posts and updates will appear here. Check back soon."
    />
  )
}

import type {Metadata} from 'next'

import {PlaceholderPageShell} from '@/components/placeholder-page-shell'

export const metadata: Metadata = {
  title: 'About',
}

export default function AboutPage() {
  return <PlaceholderPageShell title="About" />
}

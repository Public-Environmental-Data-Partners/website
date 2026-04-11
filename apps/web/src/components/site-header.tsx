import Link from 'next/link'

import {siteName} from '@/config/site'

/** Global header shell */
export function SiteHeader() {
  return (
    <header className="border-border bg-background border-b">
      <div className="mx-auto flex h-16 max-w-6xl items-center px-4 sm:px-6">
        <Link
          href="/"
          className="font-sans text-base font-semibold tracking-tight text-foreground hover:underline"
        >
          {siteName}
        </Link>
      </div>
    </header>
  )
}

import type {Metadata} from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: "What's happening",
}

const sectionLinkClass =
  'text-foreground font-medium underline decoration-foreground/40 underline-offset-4 hover:decoration-foreground'

export default function WhatsHappeningPage() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-6 py-16 md:px-12">
      <h1 className="text-foreground text-3xl font-semibold tracking-tight md:text-4xl">
        What&apos;s happening
      </h1>
      <p className="text-muted-foreground max-w-prose text-lg leading-relaxed">
        Blog posts and events—jump in below or use the site navigation.
      </p>
      <ul className="flex flex-col gap-3 text-lg">
        <li>
          <Link href="/whats-happening/blog" className={sectionLinkClass}>
            Blog
          </Link>
        </li>
        <li>
          <Link href="/whats-happening/events" className={sectionLinkClass}>
            Events
          </Link>
        </li>
      </ul>
    </div>
  )
}

import {siteName} from '@/config/site'

/** Minimal footer; expand with links and CMS later. */
export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-border bg-muted/40 border-t">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <p className="text-muted-foreground text-sm">
          © {year} {siteName}
        </p>
      </div>
    </footer>
  )
}

'use client'

import {Menu} from 'lucide-react'
import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {useState} from 'react'

import {Button} from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {donateNav, mainNav} from '@/config/nav'
import {isActiveNavPath} from '@/lib/nav-active'
import {cn} from '@/lib/utils'

const navRowTextClass = 'text-foreground block rounded-md px-3 py-2.5 text-base font-medium'

const linkClass = cn(navRowTextClass, 'transition-colors hover:text-foreground/90 hover:bg-muted')

const subLinkInactive =
  'text-muted-foreground hover:text-foreground block rounded-md py-2 pr-3 pl-6 text-sm font-medium transition-colors hover:bg-muted'

function TopLevelSheetLink({
  href,
  label,
  pathname,
  onNavigate,
}: {
  href: string
  label: string
  pathname: string
  onNavigate: () => void
}) {
  const active = isActiveNavPath(pathname, href)
  return (
    <Link
      href={href}
      className={cn(
        linkClass,
        active && 'bg-muted/60 font-semibold underline decoration-foreground/40 underline-offset-4',
      )}
      aria-current={active ? 'page' : undefined}
      onClick={onNavigate}
    >
      {label}
    </Link>
  )
}

function MobileDonateLink({pathname, onNavigate}: {pathname: string; onNavigate: () => void}) {
  const active = isActiveNavPath(pathname, donateNav.href)
  return (
    <Link
      href={donateNav.href}
      className={cn(
        'inline-flex w-full items-center justify-center rounded-full px-4 py-3 text-sm font-semibold transition-colors',
        active
          ? 'bg-primary text-primary-foreground ring-2 ring-primary-foreground/35 ring-offset-2 ring-offset-background'
          : 'bg-primary text-primary-foreground hover:bg-primary/90',
      )}
      aria-current={active ? 'page' : undefined}
      onClick={onNavigate}
    >
      {donateNav.label}
    </Link>
  )
}

function MobilePrimaryNavSheetInner() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button type="button" variant="outline" size="icon-sm" className="shrink-0">
          <Menu aria-hidden className="size-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="flex w-full max-w-sm flex-col gap-6 overflow-y-auto p-6"
      >
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
          <SheetDescription className="sr-only">Primary navigation for the site.</SheetDescription>
        </SheetHeader>
        <nav aria-label="Primary navigation" className="flex flex-1 flex-col gap-5">
          {mainNav.map((entry) =>
            entry.kind === 'group' ? (
              <div key={entry.id} className="flex flex-col gap-2">
                <p
                  className={cn(
                    navRowTextClass,
                    entry.items.some((item) => isActiveNavPath(pathname, item.href)) &&
                      'font-semibold underline decoration-foreground/40 underline-offset-4',
                  )}
                >
                  {entry.label}
                </p>
                <ul className="flex flex-col gap-0.5">
                  {entry.items.map((item) => {
                    const active = isActiveNavPath(pathname, item.href)
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={cn(
                            subLinkInactive,
                            active && 'bg-muted/80 text-foreground font-semibold',
                          )}
                          aria-current={active ? 'page' : undefined}
                          onClick={() => setOpen(false)}
                        >
                          {item.label}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ) : (
              <TopLevelSheetLink
                key={entry.href}
                href={entry.href}
                label={entry.label}
                pathname={pathname}
                onNavigate={() => setOpen(false)}
              />
            ),
          )}
          <div className="border-border mt-auto border-t pt-4">
            <MobileDonateLink pathname={pathname} onNavigate={() => setOpen(false)} />
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  )
}

/** Remount on route change so the sheet closes without syncing state in an effect. */
export function MobilePrimaryNavSheet() {
  const pathname = usePathname()
  return <MobilePrimaryNavSheetInner key={pathname} />
}

'use client'

import {Menu} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {useState} from 'react'

import {DonateLink} from '@/components/donate-link'
import {Button} from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {donateNav, type MainNavEntry} from '@/config/nav'
import {siteName} from '@/config/site'
import {isActiveNavPath} from '@/lib/nav-active'
import {cn} from '@/lib/utils'

const navRowTextClass = 'text-foreground block rounded-md px-3 py-2.5 text-[1.375rem] font-semibold'

const linkClass = cn(navRowTextClass, 'transition-colors hover:text-foreground/90 hover:bg-muted')

const subLinkInactive =
  'text-muted-foreground hover:text-foreground block rounded-md py-2 pr-3 pl-6 text-[1.375rem] font-semibold transition-colors hover:bg-muted'

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

function MobileHomeLogo({onNavigate}: {onNavigate: () => void}) {
  return (
    <Link
      href="/"
      aria-label={siteName}
      onClick={onNavigate}
      className="text-foreground focus-visible:ring-ring shrink-0 rounded-sm no-underline transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-light-beige focus-visible:outline-none"
    >
      <Image
        src="/brand/icon.webp"
        alt=""
        width={56}
        height={46}
        className="h-[46px] w-[56px] shrink-0"
      />
    </Link>
  )
}

function MobileDonateLink({onNavigate}: {onNavigate: () => void}) {
  return (
    <DonateLink
      href={donateNav.href}
      label={donateNav.label}
      variant="sheet"
      onNavigate={onNavigate}
    />
  )
}

function MobilePrimaryNavSheetInner({mainNav}: {mainNav: MainNavEntry[]}) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="text-foreground hover:bg-transparent hover:text-foreground hover:opacity-80 shrink-0 border-0 shadow-none"
        >
          <Menu aria-hidden className="size-6" strokeWidth={2} />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="bg-light-beige flex w-full max-w-sm flex-col gap-6 overflow-y-auto p-6 [&_[data-slot=sheet-close-button]]:ring-offset-light-beige"
      >
        <SheetHeader>
          <div className="flex items-center gap-3">
            <MobileHomeLogo onNavigate={() => setOpen(false)} />
            <SheetTitle>Menu</SheetTitle>
          </div>
          <SheetDescription className="sr-only">Primary navigation for the site.</SheetDescription>
        </SheetHeader>
        <nav aria-label="Primary navigation" className="flex flex-1 flex-col gap-5">
          {mainNav.map((entry, index) =>
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
                key={`sheet-link-${index}-${entry.href}`}
                href={entry.href}
                label={entry.label}
                pathname={pathname}
                onNavigate={() => setOpen(false)}
              />
            ),
          )}
          <div className="border-border mt-auto border-t pt-4">
            <MobileDonateLink onNavigate={() => setOpen(false)} />
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  )
}

/** Remount on route change so the sheet closes without syncing state in an effect. */
export function MobilePrimaryNavSheet({mainNav}: {mainNav: MainNavEntry[]}) {
  const pathname = usePathname()
  return <MobilePrimaryNavSheetInner key={pathname} mainNav={mainNav} />
}

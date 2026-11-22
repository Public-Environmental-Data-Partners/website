'use client'

import {ChevronDown, Menu} from 'lucide-react'
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
import {donateNav, type MainNavEntry, type NavGroup} from '@/config/nav'
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

function MobileNavGroup({
  entry,
  pathname,
  expanded,
  onToggle,
  onNavigate,
}: {
  entry: NavGroup
  pathname: string
  expanded: boolean
  onToggle: () => void
  onNavigate: () => void
}) {
  const groupHasActive = entry.items.some((item) => isActiveNavPath(pathname, item.href))
  const listId = `mobile-nav-${entry.id}`

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        className={cn(
          navRowTextClass,
          'focus-visible:ring-ring flex w-full items-center justify-between gap-3 text-left transition-colors hover:bg-muted hover:text-foreground/90 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-light-beige focus-visible:outline-none',
          groupHasActive && 'underline decoration-foreground/40 underline-offset-4',
        )}
        aria-expanded={expanded}
        aria-controls={listId}
        onClick={onToggle}
      >
        <span>{entry.label}</span>
        <ChevronDown
          aria-hidden
          className={cn('size-4 shrink-0 opacity-90', expanded && 'rotate-180')}
        />
      </button>
      <ul id={listId} className={cn('flex flex-col gap-0.5', !expanded && 'hidden')}>
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
                onClick={onNavigate}
              >
                {item.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function MobilePrimaryNavSheetInner({mainNav}: {mainNav: MainNavEntry[]}) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  function closeSheet() {
    setOpen(false)
    setExpandedId(null)
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) {
          setExpandedId(null)
        }
      }}
    >
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
          <SheetTitle>Menu</SheetTitle>
          <SheetDescription className="sr-only">Primary navigation for the site.</SheetDescription>
        </SheetHeader>
        <nav aria-label="Primary navigation" className="flex flex-1 flex-col gap-5">
          {mainNav.map((entry, index) =>
            entry.kind === 'group' ? (
              <MobileNavGroup
                key={entry.id}
                entry={entry}
                pathname={pathname}
                expanded={expandedId === entry.id}
                onToggle={() =>
                  setExpandedId((current) => (current === entry.id ? null : entry.id))
                }
                onNavigate={closeSheet}
              />
            ) : (
              <TopLevelSheetLink
                key={`sheet-link-${index}-${entry.href}`}
                href={entry.href}
                label={entry.label}
                pathname={pathname}
                onNavigate={closeSheet}
              />
            ),
          )}
          <div className="border-border mt-auto border-t pt-4">
            <MobileDonateLink onNavigate={closeSheet} />
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

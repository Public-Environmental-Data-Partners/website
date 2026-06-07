import Link from 'next/link'

import {cn} from '@/lib/utils'

type NewsHubPaginationProps = {
  currentPage: number
  totalPages: number
  className?: string
}

function pageHref(page: number) {
  if (page <= 1) {
    return '/news-and-updates'
  }
  return `/news-and-updates?page=${page}`
}

export function NewsHubPagination({currentPage, totalPages, className}: NewsHubPaginationProps) {
  if (totalPages <= 1) {
    return null
  }

  const pages = Array.from({length: totalPages}, (_, index) => index + 1)

  return (
    <nav className={cn('mt-2 flex justify-center gap-2', className)} aria-label="Pagination">
      {pages.map((page) => {
        const isActive = page === currentPage
        return (
          <Link
            key={page}
            href={pageHref(page)}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'inline-flex min-h-8 min-w-8 items-center justify-center rounded border text-xs font-semibold',
              isActive
                ? 'border-navy bg-navy text-white'
                : 'border-border text-navy hover:bg-muted/50 transition-colors',
            )}
          >
            {page}
          </Link>
        )
      })}
    </nav>
  )
}

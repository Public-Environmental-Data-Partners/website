import {formatPhotoCredit} from '@/lib/format-photo-credit'
import {cn} from '@/lib/utils'

export type ArticlePhotoCreditAlign = 'left' | 'center'

type ArticlePhotoCreditProps = {
  credit: string
  align?: ArticlePhotoCreditAlign
  className?: string
}

export function ArticlePhotoCredit({credit, align = 'left', className}: ArticlePhotoCreditProps) {
  const label = formatPhotoCredit(credit)
  if (!label) {
    return null
  }

  return (
    <figcaption
      data-slot="article-figure-credit"
      className={cn(
        'text-foreground font-normal uppercase',
        align === 'center' ? 'text-center' : 'text-left',
        className,
      )}
    >
      {label}
    </figcaption>
  )
}

import {
  defaultComponents,
  mergeComponents,
  PortableText,
  type PortableTextBlock,
  type PortableTextComponents,
} from '@portabletext/react'
import type {ReactNode} from 'react'

import {contentLinkMark} from '@/components/content/portable-text-link'
import {ContentLink} from '@/components/content-link'
import {Button} from '@/components/ui/button'
import {cn} from '@/lib/utils'

const bodyPortableTextComponents: Partial<PortableTextComponents> = {
  block: {
    normal: ({children}: {children?: ReactNode}) => (
      <p className="text-body-lg text-foreground font-sans font-normal last:mb-0">{children}</p>
    ),
  },
  marks: {
    strong: ({children}: {children?: ReactNode}) => (
      <strong className="font-semibold">{children}</strong>
    ),
    link: contentLinkMark(
      'text-foreground underline underline-offset-[0.2em] transition-opacity hover:opacity-80',
    ),
  },
}

const richTextComponents = mergeComponents(defaultComponents, bodyPortableTextComponents)

export type IconCardProps = {
  /** Decorative or informative icon element (e.g. next/image). */
  icon: ReactNode
  title: string
  body: PortableTextBlock[]
  ctaLabel: string
  href?: string
  external?: boolean
  /** Center the third card on tablet when used in a 2-column md / 3-column lg grid. */
  centerOnTablet?: boolean
  className?: string
}

/**
 * Shared icon + title + body + CTA card used by What We Do and Other Ways.
 * Mobile: full width. Parent grid owns column spans.
 */
export function IconCard({
  icon,
  title,
  body,
  ctaLabel,
  href,
  external,
  centerOnTablet = false,
  className,
}: IconCardProps) {
  return (
    <article
      className={cn(
        'flex flex-col items-center text-center',
        centerOnTablet &&
          'md:col-span-2 md:mx-auto md:w-full md:max-w-[calc((100%-3rem)/2)] lg:col-span-1 lg:max-w-none',
        className,
      )}
    >
      <div className="relative mb-12 flex h-[10.8125rem] w-[10.8125rem] items-center justify-center">
        {icon}
      </div>
      <h3 className="text-foreground mb-10 font-sans text-[1.375rem] font-medium tracking-wide uppercase">
        {title}
      </h3>
      <div className="mb-8 w-full max-w-prose space-y-4 text-left">
        <PortableText components={richTextComponents} value={body} />
      </div>
      {href ? (
        <Button asChild variant="surface" size="cta" className="mt-auto">
          <ContentLink href={href} external={external}>
            {ctaLabel}
          </ContentLink>
        </Button>
      ) : null}
    </article>
  )
}

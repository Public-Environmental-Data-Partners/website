import {
  defaultComponents,
  mergeComponents,
  PortableText,
  type PortableTextBlock,
  type PortableTextComponents,
} from '@portabletext/react'
import Image from 'next/image'
import Link from 'next/link'

import {ContentStack, SectionBand, SiteShell} from '@/components/layout'
import {Button} from '@/components/ui/button'
import {
  WHAT_WE_DO_ICON_SRC,
  type WhatWeDoItemProps,
  type WhatWeDoSectionProps,
} from '@/lib/mappers/what-we-do-section'
import {cn} from '@/lib/utils'

const bodyPortableTextComponents: Partial<PortableTextComponents> = {
  block: {
    normal: ({children}: {children?: React.ReactNode}) => (
      <p className="text-body-lg text-foreground font-sans font-normal last:mb-0">{children}</p>
    ),
  },
  marks: {
    strong: ({children}: {children?: React.ReactNode}) => (
      <strong className="font-semibold">{children}</strong>
    ),
    link: ({children, value}: {children?: React.ReactNode; value?: {href?: string}}) => {
      const href = typeof value?.href === 'string' ? value.href : '#'
      const openExternal = /^https?:\/\//i.test(href)
      return (
        <a
          href={href}
          className="text-foreground underline underline-offset-[0.2em] transition-opacity hover:opacity-80"
          rel={openExternal ? 'noopener noreferrer' : undefined}
          target={openExternal ? '_blank' : undefined}
        >
          {children}
        </a>
      )
    },
  },
}

const richTextComponents = mergeComponents(defaultComponents, bodyPortableTextComponents)

function WhatWeDoBody({value}: {value: PortableTextBlock[]}) {
  return <PortableText components={richTextComponents} value={value} />
}

function WhatWeDoItemCard({item, index}: {item: WhatWeDoItemProps; index: number}) {
  const iconSrc = WHAT_WE_DO_ICON_SRC[item.icon]
  const centerThirdOnTablet =
    index === 2
      ? 'md:col-span-2 md:mx-auto md:w-full md:max-w-[calc((100%-3rem)/2)] lg:col-span-1 lg:max-w-none'
      : undefined

  return (
    <article
      className={cn(
        'flex flex-col items-center text-center',
        centerThirdOnTablet,
      )}
    >
      <div className="relative mb-12 flex h-[10.8125rem] w-[10.8125rem] items-center justify-center">
        <Image
          src={iconSrc}
          alt=""
          width={173}
          height={173}
          className="h-full w-full object-contain"
          unoptimized
        />
      </div>
      <h3 className="text-foreground mb-10 font-sans text-[1.375rem] font-medium tracking-wide uppercase">
        {item.title}
      </h3>
      <div className="mb-8 w-full max-w-prose space-y-4 text-left">
        <WhatWeDoBody value={item.body} />
      </div>
      {item.href ? (
        <Button asChild variant="surface" size="cta" className="mt-auto">
          <Link href={item.href}>{item.ctaLabel}</Link>
        </Button>
      ) : null}
    </article>
  )
}

/**
 * `whatWeDoSection` CMS block.
 * Mobile: 1 column. Tablet: 2 + 1 centered. Desktop: 3 columns.
 */
export function WhatWeDoSection({heading, items}: WhatWeDoSectionProps) {
  const headingId = 'what-we-do-heading'

  return (
    <SectionBand className="bg-off-white" aria-labelledby={headingId}>
      <SiteShell>
        <ContentStack className="gap-10 md:gap-12">
          <h2
            id={headingId}
            className="section-label-heading text-muted-foreground text-center md:text-left"
          >
            {heading}
          </h2>
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-x-12 md:gap-y-16 lg:grid-cols-3">
            {items.map((item, index) => (
              <WhatWeDoItemCard key={item.keyId} item={item} index={index} />
            ))}
          </div>
        </ContentStack>
      </SiteShell>
    </SectionBand>
  )
}

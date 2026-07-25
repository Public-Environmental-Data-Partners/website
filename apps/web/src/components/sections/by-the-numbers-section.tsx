import {
  defaultComponents,
  mergeComponents,
  PortableText,
  type PortableTextBlock,
  type PortableTextComponents,
} from '@portabletext/react'
import Image from 'next/image'

import {contentLinkMark} from '@/components/content/portable-text-link'
import {ContentLink} from '@/components/content-link'
import {ContentStack, SectionBand, SiteShell} from '@/components/layout'
import {Button} from '@/components/ui/button'
import {
  BY_THE_NUMBERS_ICON_SRC,
  type ByTheNumbersSectionProps,
  type ByTheNumbersStatProps,
} from '@/lib/mappers/by-the-numbers-section'
import {cn} from '@/lib/utils'

const bodyPortableTextComponents: Partial<PortableTextComponents> = {
  block: {
    normal: ({children}: {children?: React.ReactNode}) => (
      <p className="font-sans text-[1.375rem] leading-none font-normal text-foreground last:mb-0">
        {children}
      </p>
    ),
  },
  marks: {
    strong: ({children}: {children?: React.ReactNode}) => (
      <strong className="font-semibold">{children}</strong>
    ),
    link: contentLinkMark(
      'text-foreground underline underline-offset-[0.2em] transition-opacity hover:opacity-80',
    ),
  },
}

const richTextComponents = mergeComponents(defaultComponents, bodyPortableTextComponents)

function StatBody({value}: {value: PortableTextBlock[]}) {
  return <PortableText components={richTextComponents} value={value} />
}

function StatColumn({stat, index}: {stat: ByTheNumbersStatProps; index: number}) {
  const iconSrc = BY_THE_NUMBERS_ICON_SRC[stat.icon]
  const centerThirdOnTablet =
    index === 2
      ? 'md:col-span-2 md:mx-auto md:w-full md:max-w-[calc((100%-3rem)/2)] lg:col-span-1 lg:max-w-none'
      : undefined

  const cta =
    stat.href && stat.ctaLabel ? (
      <Button asChild variant="surface" size="cta" className="mt-auto">
        <ContentLink href={stat.href} external={stat.external}>
          {stat.ctaLabel}
        </ContentLink>
      </Button>
    ) : null

  return (
    <article className={cn('flex flex-col items-center text-center', centerThirdOnTablet)}>
      <div className="mb-2 flex h-[6.5rem] w-full max-w-[13.5rem] items-center justify-center md:mb-2.5 md:h-[10.5rem]">
        <Image
          src={iconSrc}
          alt=""
          width={214}
          height={167}
          className="h-full w-auto max-w-full object-contain"
          unoptimized
        />
      </div>
      <p className="font-serif text-[7.5rem] leading-none font-medium italic tracking-normal text-foreground">
        {stat.value}
      </p>
      <p className="mt-3 font-sans text-[1.25rem] leading-none font-medium text-foreground">
        {stat.label}
      </p>
      <div className="mt-10 mb-12 max-w-[28rem] space-y-3 md:mt-12 md:mb-14">
        <StatBody value={stat.body} />
      </div>
      {cta}
    </article>
  )
}

/**
 * `byTheNumbersSection` CMS block.
 * Mobile: 1 column. Tablet: 2 + 1 centered. Desktop: 3 columns.
 */
export function ByTheNumbersSection({kicker, stats}: ByTheNumbersSectionProps) {
  if (stats.length === 0) {
    return null
  }

  const headingId = 'by-the-numbers-heading'

  return (
    <SectionBand className="bg-off-white" aria-labelledby={headingId}>
      <SiteShell>
        <ContentStack className="gap-10 md:gap-12">
          <h2
            id={headingId}
            className="section-label-heading text-muted-foreground text-center md:text-left"
          >
            {kicker}
          </h2>
          <div className="grid grid-cols-1 gap-14 md:grid-cols-2 md:gap-x-12 md:gap-y-16 lg:grid-cols-3">
            {stats.map((stat, index) => (
              <StatColumn key={stat.keyId} stat={stat} index={index} />
            ))}
          </div>
        </ContentStack>
      </SiteShell>
    </SectionBand>
  )
}

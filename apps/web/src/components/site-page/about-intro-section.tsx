import {
  defaultComponents,
  mergeComponents,
  PortableText,
  type PortableTextBlock,
  type PortableTextComponents,
} from '@portabletext/react'
import Image from 'next/image'
import type {ReactNode} from 'react'

import {contentLinkMark} from '@/components/content/portable-text-link'
import type {HeroImage} from '@/components/hero/hero-image'
import {Grid12, SectionBand, SiteShell} from '@/components/layout'

type AboutIntroSectionProps = {
  title: string
  body: PortableTextBlock[]
  image: HeroImage
}

const portableTextComponents: Partial<PortableTextComponents> = {
  block: {
    normal: ({children}: {children?: ReactNode}) => (
      <p className="text-off-black mb-6 font-sans text-[1.375rem] leading-none font-normal tracking-normal last:mb-0">
        {children}
      </p>
    ),
  },
  list: {
    bullet: ({children}: {children?: ReactNode}) => (
      <ul className="text-off-black mb-6 list-disc space-y-3 ps-6 font-sans text-[1.375rem] leading-none font-normal last:mb-0">
        {children}
      </ul>
    ),
    number: ({children}: {children?: ReactNode}) => (
      <ol className="text-off-black mb-6 list-decimal space-y-3 ps-6 font-sans text-[1.375rem] leading-none font-normal last:mb-0">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({children}: {children?: ReactNode}) => <li>{children}</li>,
    number: ({children}: {children?: ReactNode}) => <li>{children}</li>,
  },
  marks: {
    strong: ({children}: {children?: ReactNode}) => (
      <strong className="font-bold">{children}</strong>
    ),
    link: contentLinkMark('text-off-black underline underline-offset-2'),
  },
}

const richTextComponents = mergeComponents(defaultComponents, portableTextComponents)

/**
 * About page intro: page title + Portable Text body (cols 2–6) and CMS illustration.
 * Mobile stacks title → image → body. Desktop places image beside the full text column,
 * vertically centered to that column’s height.
 */
export function AboutIntroSection({title, body, image}: AboutIntroSectionProps) {
  return (
    <SectionBand className="bg-cream">
      <SiteShell padding="grid" className="pt-10 pb-8 md:pt-12 md:pb-10">
        <Grid12 className="gap-y-8 lg:gap-y-6">
          <h1 className="text-off-black col-span-12 min-w-0 font-sans text-[1.375rem] leading-none font-bold tracking-normal uppercase lg:col-span-5 lg:col-start-2 lg:row-start-1">
            {title}
          </h1>
          <div className="col-span-12 flex min-w-0 justify-center lg:col-span-5 lg:col-start-8 lg:row-span-2 lg:row-start-1 lg:items-center lg:justify-end">
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width ?? 470}
              height={image.height ?? 352}
              sizes="(max-width: 1023px) calc(100vw - 32px), 470px"
              className="h-auto w-full max-w-[29.375rem] object-contain"
              priority
            />
          </div>
          {body.length > 0 ? (
            <div className="col-span-12 min-w-0 lg:col-span-5 lg:col-start-2 lg:row-start-2">
              <PortableText components={richTextComponents} value={body} />
            </div>
          ) : null}
        </Grid12>
      </SiteShell>
    </SectionBand>
  )
}

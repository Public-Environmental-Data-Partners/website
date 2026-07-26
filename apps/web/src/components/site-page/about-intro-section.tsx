import {PortableText, type PortableTextBlock} from '@portabletext/react'
import Image from 'next/image'

import {sectionBodyRichTextComponents} from '@/components/content/section-body-rich-text'
import type {HeroImage} from '@/components/hero/hero-image'
import {Grid12, SectionBand, SiteShell} from '@/components/layout'
import {SECTION_LABEL_HEADING_CLASS} from '@/lib/typography'
import {cn} from '@/lib/utils'

type AboutIntroSectionProps = {
  title: string
  body: PortableTextBlock[]
  image: HeroImage
}

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
          <h1
            className={cn(
              SECTION_LABEL_HEADING_CLASS,
              'text-off-black col-span-12 min-w-0 lg:col-span-5 lg:col-start-2 lg:row-start-1',
            )}
          >
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
              <PortableText components={sectionBodyRichTextComponents} value={body} />
            </div>
          ) : null}
        </Grid12>
      </SiteShell>
    </SectionBand>
  )
}

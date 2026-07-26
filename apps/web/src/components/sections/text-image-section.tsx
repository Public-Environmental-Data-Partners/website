import {PortableText} from '@portabletext/react'
import Image from 'next/image'

import {sectionBodyRichTextComponents} from '@/components/content/section-body-rich-text'
import {Grid12} from '@/components/layout'
import {TEXT_IMAGE_SIZES, type TextImageSectionProps} from '@/lib/mappers/text-image-section'
import {cn} from '@/lib/utils'

/**
 * `textImageSection` row. Desktop: image right → text cols 2–6, image 7–11;
 * image left → image cols 1–6, text 7–11; vertically centered. Mobile stacks
 * illustration then text. Without an illustration the text stays in cols 2–6.
 * The page owns the shell, band color, and vertical rhythm.
 */
export function TextImageSection({body, image, imagePosition}: TextImageSectionProps) {
  const imageLeft = imagePosition === 'left'

  const textColClass =
    image && imageLeft ? 'lg:col-start-7 lg:order-2' : 'lg:col-start-2 lg:order-1'
  const imageColClass = imageLeft
    ? 'lg:col-span-6 lg:col-start-1 lg:order-1'
    : 'lg:col-span-5 lg:col-start-7 lg:order-2'

  return (
    <Grid12 data-slot="text-image-section" className="items-center gap-y-8 lg:gap-y-0">
      {image ? (
        <div className={cn('col-span-12 order-1 min-w-0 lg:row-start-1', imageColClass)}>
          <div className="relative aspect-[4/3] w-full overflow-hidden">
            <Image
              alt={image.alt}
              src={image.src}
              fill
              className="object-cover"
              sizes={TEXT_IMAGE_SIZES}
            />
          </div>
        </div>
      ) : null}
      <div className={cn('col-span-12 order-2 min-w-0 lg:col-span-5 lg:row-start-1', textColClass)}>
        <PortableText components={sectionBodyRichTextComponents} value={body} />
      </div>
    </Grid12>
  )
}

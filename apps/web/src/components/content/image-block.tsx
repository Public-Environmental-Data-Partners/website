import Image from 'next/image'

import type {HeroImage} from '@/components/hero/hero-image'

type ImageBlockProps = {
  image: HeroImage
  caption?: string | null
  source?: string | null
}

export function ImageBlock({image, caption, source}: ImageBlockProps) {
  const trimmedCaption = caption?.trim()
  const trimmedSource = source?.trim()
  const hasCaptionBand = Boolean(trimmedCaption || trimmedSource)

  return (
    <figure data-slot="article-image-block">
      <div data-slot="article-image-row">
        <div data-slot="article-image-bleed-slot" aria-hidden="true" />
        <div data-slot="article-image-frame">
          <Image
            alt={image.alt}
            className="object-cover"
            fill
            sizes="(max-width: 767px) 100vw, 65ch"
            src={image.src}
          />
        </div>
      </div>
      {hasCaptionBand ? (
        <figcaption data-slot="article-image-caption-band">
          <div data-slot="article-image-caption-leading">
            {trimmedCaption ? <p data-slot="article-image-caption">{trimmedCaption}</p> : null}
            {trimmedSource ? <p data-slot="article-image-source">Source: {trimmedSource}</p> : null}
          </div>
          <div data-slot="article-image-caption-trailing" aria-hidden="true" />
        </figcaption>
      ) : null}
    </figure>
  )
}

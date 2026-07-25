import Image from 'next/image'

import type {HeroImage} from '@/components/hero/hero-image'
import {Grid12, SectionBand, SiteShell} from '@/components/layout'

type ContactHeroSectionProps = {
  title: string
  image: HeroImage
}

/** Contact page title + CMS-managed illustration. */
export function ContactHeroSection({title, image}: ContactHeroSectionProps) {
  return (
    <SectionBand className="bg-cream">
      <SiteShell padding="grid" className="pt-10 pb-8 md:pt-12 md:pb-10">
        <Grid12>
          <header className="col-span-12 flex min-w-0 flex-col items-center text-center">
            <h1 className="text-off-black font-sans text-[1.375rem] leading-none font-semibold tracking-normal uppercase">
              {title}
            </h1>
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width ?? 382}
              height={image.height ?? 356}
              sizes="(max-width: 767px) calc(100vw - 32px), 382px"
              className="mt-8 h-auto w-full max-w-[23.875rem] object-contain"
              priority
            />
          </header>
        </Grid12>
      </SiteShell>
    </SectionBand>
  )
}

import {PortableText} from '@portabletext/react'

import type {HeroImage} from '@/components/hero/hero-image'
import {HeroImageBlock} from '@/components/hero/hero-image'
import {cn} from '@/lib/utils'

export type HeroSectionProps = {
  eyebrow?: string
  title: string
  body?: unknown
  image?: HeroImage
  imageMobile?: HeroImage
  hideImageOnMobile?: boolean
  /** Embedded image + 3fr/2fr grid (homepage). When false, default inner-page hero. */
  homePageStyle?: boolean
}

function DefaultHeroShelf() {
  return (
    <div aria-hidden className="relative h-[50px] w-full shrink-0 overflow-visible">
      <div className="absolute inset-y-0 left-[calc(50%-50vw)] w-[calc(50vw+15%)] bg-background" />
      <div className="relative flex h-full w-full">
        <div className="w-[65%] shrink-0" />
        <div className="bg-light-beige w-[35%] shrink-0" />
      </div>
    </div>
  )
}

function DefaultHeroSection({
  eyebrow,
  title,
  body,
  image,
  imageMobile,
  hideImageOnMobile,
}: Omit<HeroSectionProps, 'homePageStyle'>) {
  return (
    <section className="relative bg-light-beige">
      <div className="relative mx-auto w-full max-w-site overflow-visible">
        <div className="relative overflow-visible">
          <div
            aria-hidden
            className="absolute top-0 bottom-0 left-[calc(50%-50vw)] z-10 hidden w-[calc(50vw-50%+1.25rem)] bg-beige lg:block"
          />
          <div className="relative px-6 py-12 md:px-12 lg:py-16 lg:pr-0">
            <div className="flex flex-col gap-6 lg:max-w-[calc(50%-1.5rem)] lg:pl-2">
              {eyebrow ? (
                <p className="text-muted-foreground font-semibold uppercase tracking-wide">
                  {eyebrow}
                </p>
              ) : null}
              <h1 className="hero-primary-heading text-foreground font-medium leading-tight tracking-tight">
                {title}
              </h1>
              {body ? (
                <div className="text-foreground/90 max-w-none space-y-4 leading-relaxed">
                  <PortableText value={body as never} />
                </div>
              ) : null}
            </div>

            <div
              className={cn(
                'relative mt-8 min-h-[16rem] w-full lg:mt-0',
                hideImageOnMobile ? 'hidden' : 'lg:hidden',
              )}
            >
              <HeroImageBlock variant="default" image={image} imageMobile={imageMobile} />
            </div>
          </div>

          <HeroImageBlock
            variant="default"
            image={image}
            imageMobile={imageMobile}
            hideImageOnMobile={hideImageOnMobile}
            fillContainer
            className="absolute top-0 right-0 bottom-0 hidden w-1/2 lg:block"
          />
        </div>

        <DefaultHeroShelf />
      </div>
    </section>
  )
}

function HomeHeroSection({
  eyebrow,
  title,
  body,
  image,
  imageMobile,
  hideImageOnMobile,
}: Omit<HeroSectionProps, 'homePageStyle'>) {
  return (
    <section className="relative bg-background">
      <div className="mx-auto grid w-full max-w-site gap-8 px-6 py-12 md:px-12 lg:grid-cols-[3fr_2fr] lg:gap-12 lg:py-16">
        <div className="flex flex-col gap-6">
          {eyebrow ? (
            <p className="text-muted-foreground font-semibold uppercase tracking-wide">{eyebrow}</p>
          ) : null}
          <h1 className="hero-primary-heading text-foreground font-medium leading-tight tracking-tight">
            {title}
          </h1>
          {body ? (
            <div className="text-foreground/90 max-w-none space-y-4 leading-relaxed">
              <PortableText value={body as never} />
            </div>
          ) : null}
        </div>
        <HeroImageBlock
          variant="home"
          image={image}
          imageMobile={imageMobile}
          hideImageOnMobile={hideImageOnMobile}
        />
      </div>
    </section>
  )
}

export function HeroSection({homePageStyle = false, ...props}: HeroSectionProps) {
  if (homePageStyle) {
    return <HomeHeroSection {...props} />
  }
  return <DefaultHeroSection {...props} />
}

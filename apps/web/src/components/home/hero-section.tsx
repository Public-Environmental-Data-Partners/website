import {
  defaultComponents,
  mergeComponents,
  PortableText,
  type PortableTextBlock,
  type PortableTextComponents,
} from '@portabletext/react'

import {contentLinkMark} from '@/components/content/portable-text-link'
import {ContentLink} from '@/components/content-link'
import type {HeroImage} from '@/components/hero/hero-image'
import {SectionBand, SiteShell} from '@/components/layout'
import {ImageWithShelf} from '@/components/media/image-with-shelf'
import {Button} from '@/components/ui/button'
import type {ImageShelfSettings} from '@/lib/mappers/image-shelf'
import {DEFAULT_IMAGE_SHELF_SETTINGS} from '@/lib/mappers/image-shelf'

export type HomeHeroCta = {
  label: string
  href: string
  external?: boolean
}

export type HomeHeroSectionProps = {
  title: string
  paragraph1: PortableTextBlock[]
  paragraph2?: PortableTextBlock[]
  paragraph3?: PortableTextBlock[]
  primaryCta?: HomeHeroCta
  secondaryCta?: HomeHeroCta
  image: HeroImage
  imageShelf?: ImageShelfSettings
}

const homeHeroPortableTextComponents: Partial<PortableTextComponents> = {
  block: {
    normal: ({children}: {children?: React.ReactNode}) => (
      <p className="text-body-lg text-foreground font-sans font-normal last:mb-0">{children}</p>
    ),
  },
  marks: {
    strong: ({children}: {children?: React.ReactNode}) => (
      <strong className="font-semibold">{children}</strong>
    ),
    link: contentLinkMark('text-foreground underline-offset-[0.2em]'),
  },
}

const richTextComponents = mergeComponents(defaultComponents, homeHeroPortableTextComponents)

function HomeHeroParagraph({value}: {value: PortableTextBlock[]}) {
  return <PortableText components={richTextComponents} value={value} />
}

/**
 * `homeHero` CMS block — Home Hero Section.
 * Desktop: text left / image right (independent columns so the image shelf
 * never stretches text row gaps). Mobile: headline → p1 → image → p2 → p3 → CTAs.
 */
function HomeHeroCtaButton({cta}: {cta: HomeHeroCta}) {
  return (
    <Button asChild size="cta" variant="lightBlue">
      <ContentLink href={cta.href} external={cta.external}>
        {cta.label}
      </ContentLink>
    </Button>
  )
}

export function HomeHeroSection({
  title,
  paragraph1,
  paragraph2,
  paragraph3,
  primaryCta,
  secondaryCta,
  image,
  imageShelf = DEFAULT_IMAGE_SHELF_SETTINGS,
}: HomeHeroSectionProps) {
  const ctas = [primaryCta, secondaryCta].filter((cta): cta is HomeHeroCta => Boolean(cta))

  return (
    <SectionBand className="bg-cream" aria-label={title} overflowHidden={false}>
      <SiteShell>
        <div className="flex flex-col gap-8 lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-12 lg:gap-y-0">
          <div className="flex flex-col gap-8">
            <h1 className="hero-primary-heading text-foreground font-serif font-medium tracking-normal">
              {title}
            </h1>
            <HomeHeroParagraph value={paragraph1} />
            <ImageWithShelf
              className="lg:hidden"
              fetchPriority="high"
              image={image}
              shelf={imageShelf}
            />
            {paragraph2 ? <HomeHeroParagraph value={paragraph2} /> : null}
            {paragraph3 ? <HomeHeroParagraph value={paragraph3} /> : null}
            {ctas.length > 0 ? (
              <div className="flex flex-col items-center gap-4 lg:flex-row lg:items-start lg:justify-start lg:gap-x-10">
                {ctas.map((cta) => (
                  <HomeHeroCtaButton key={`${cta.href}-${cta.label}`} cta={cta} />
                ))}
              </div>
            ) : null}
          </div>

          <ImageWithShelf
            className="hidden lg:block"
            fetchPriority="high"
            image={image}
            shelf={imageShelf}
          />
        </div>
      </SiteShell>
    </SectionBand>
  )
}

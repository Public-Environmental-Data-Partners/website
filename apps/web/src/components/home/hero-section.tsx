import {
  defaultComponents,
  mergeComponents,
  PortableText,
  type PortableTextBlock,
  type PortableTextComponents,
} from '@portabletext/react'

import type {HeroImage} from '@/components/hero/hero-image'
import {SectionBand, SiteShell} from '@/components/layout'
import {ImageWithShelf} from '@/components/media/image-with-shelf'
import type {ImageShelfSettings} from '@/lib/mappers/image-shelf'
import {DEFAULT_IMAGE_SHELF_SETTINGS} from '@/lib/mappers/image-shelf'

export type HomeHeroSectionProps = {
  title: string
  paragraph1: PortableTextBlock[]
  paragraph2?: PortableTextBlock[]
  paragraph3?: PortableTextBlock[]
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

const richTextComponents = mergeComponents(defaultComponents, homeHeroPortableTextComponents)

function HomeHeroParagraph({value}: {value: PortableTextBlock[]}) {
  return <PortableText components={richTextComponents} value={value} />
}

/**
 * `homeHero` CMS block — Home Hero Section.
 * Desktop: text left / image right (independent columns so the image shelf
 * never stretches text row gaps). Mobile: headline → p1 → image → p2 → p3.
 */
export function HomeHeroSection({
  title,
  paragraph1,
  paragraph2,
  paragraph3,
  image,
  imageShelf = DEFAULT_IMAGE_SHELF_SETTINGS,
}: HomeHeroSectionProps) {
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

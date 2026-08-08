import {
  defaultComponents,
  mergeComponents,
  PortableText,
  type PortableTextComponents,
} from '@portabletext/react'

import {ToolCard} from '@/components/cards/tool-card'
import {contentLinkMark} from '@/components/content/portable-text-link'
import {ContentLink} from '@/components/content-link'
import {ContentStack, Grid12, SectionBand, SiteShell} from '@/components/layout'
import {Button} from '@/components/ui/button'
import type {ToolCategorySectionProps} from '@/lib/mappers/tools-development'

const bodyPortableTextComponents: Partial<PortableTextComponents> = {
  block: {
    normal: ({children}: {children?: React.ReactNode}) => (
      <p className="text-off-black mb-4 font-sans text-[1.375rem] leading-none font-normal tracking-normal last:mb-0">
        {children}
      </p>
    ),
  },
  marks: {
    strong: ({children}: {children?: React.ReactNode}) => (
      <strong className="font-semibold">{children}</strong>
    ),
    link: contentLinkMark(
      'text-off-black underline underline-offset-2 transition-opacity hover:opacity-80',
    ),
  },
}

const richTextComponents = mergeComponents(defaultComponents, bodyPortableTextComponents)

/**
 * Tool category band: section heading, intro, optional guide CTA, tool cards grid.
 * Cards: 12-col mobile, 6-col tablet, 4-col desktop (left-justified wrap).
 * Guide CTA: cols 9–12 at `lg+` (2-col gap after intro); stacked below `lg`.
 */
export function ToolCategorySection({
  sectionHeading,
  body,
  guidePrompt,
  guideCtaLabel,
  guideHref,
  guideExternal,
  cards,
  headingId,
}: ToolCategorySectionProps) {
  const showGuide = Boolean(guidePrompt && guideCtaLabel && guideHref)

  return (
    <SectionBand className="bg-cream" aria-labelledby={headingId}>
      <SiteShell padding="grid" className="py-10 md:py-14">
        <ContentStack className="gap-10 md:gap-12">
          <Grid12 className="items-start gap-y-8">
            <div className={showGuide ? 'col-span-12 lg:col-span-6' : 'col-span-12 lg:col-span-8'}>
              <h2 id={headingId} className="section-label-heading text-off-black mb-5">
                {sectionHeading}
              </h2>
              <PortableText components={richTextComponents} value={body} />
            </div>
            {showGuide ? (
              <div className="col-span-12 flex flex-col gap-5 lg:col-span-4 lg:col-start-9 lg:pt-10">
                <p className="text-off-black text-left font-sans text-[1.375rem] leading-none font-normal tracking-normal">
                  {guidePrompt}
                </p>
                <div className="flex w-full justify-center">
                  <Button asChild variant="lightBeige" size="cta">
                    <ContentLink href={guideHref!} external={guideExternal}>
                      {guideCtaLabel}
                    </ContentLink>
                  </Button>
                </div>
              </div>
            ) : null}
          </Grid12>

          {cards.length > 0 ? (
            <Grid12 className="items-stretch gap-y-8 md:gap-y-10">
              {cards.map((card) => (
                <ToolCard key={card.keyId} {...card} />
              ))}
            </Grid12>
          ) : null}
        </ContentStack>
      </SiteShell>
    </SectionBand>
  )
}

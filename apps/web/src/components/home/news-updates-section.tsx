import Image from 'next/image'
import Link from 'next/link'

type NewsCard = {
  title: string
  href: string
  chip: string
  excerpt?: string
  photoCredit?: string
  imageSrc: string
  imageAlt: string
  imageWidth?: number
  imageHeight?: number
}

export type NewsUpdatesSectionProps = {
  heading: string
  cards: NewsCard[]
}

function imageDimension(value: number | undefined, fallback: number) {
  return typeof value === 'number' && value > 0 ? value : fallback
}

export function NewsUpdatesSection({heading, cards}: NewsUpdatesSectionProps) {
  if (cards.length === 0) {
    return null
  }

  return (
    <section className="bg-primary/35">
      <div className="mx-auto w-full max-w-6xl px-6 py-10 md:px-12 md:py-14">
        <h2 className="section-label-heading text-foreground mb-5 md:mb-7">{heading}</h2>
        <div className="-mx-6 overflow-x-auto px-6 md:mx-0 md:px-0">
          <div className="grid w-max min-w-full grid-flow-col auto-cols-[minmax(18rem,18rem)] gap-5 pb-2 md:w-full md:grid-flow-row md:grid-cols-3 md:auto-cols-auto md:gap-6">
            {cards.map((card) => (
              <Link
                key={`${card.href}-${card.title}`}
                href={card.href}
                className="group bg-surface border-border flex h-full min-h-[26rem] flex-col border"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={card.imageSrc}
                    alt={card.imageAlt}
                    width={imageDimension(card.imageWidth, 1200)}
                    height={imageDimension(card.imageHeight, 900)}
                    className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
                  />
                </div>
                <div className="flex items-start justify-between gap-3 px-4 py-3">
                  <h3 className="text-foreground text-sm font-medium uppercase tracking-wide">
                    {card.title}
                  </h3>
                  {card.photoCredit ? (
                    <p className="text-muted-foreground max-w-[10rem] text-right text-xs leading-snug">
                      {card.photoCredit}
                    </p>
                  ) : null}
                </div>
                <div className="flex flex-1 flex-col justify-between gap-4 px-4 pb-4">
                  {card.excerpt ? (
                    <p className="text-muted-foreground line-clamp-4 text-sm leading-relaxed">
                      {card.excerpt}
                    </p>
                  ) : (
                    <span />
                  )}
                  <div className="flex justify-end">
                    <span className="text-muted-foreground border-border rounded-full border bg-background px-3 py-1 text-xs font-medium">
                      {card.chip}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

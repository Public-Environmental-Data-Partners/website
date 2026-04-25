import Image from 'next/image'

type CoalitionPartner = {
  name: string
  href: string
  ariaLabel: string
  logoSrc: string
  logoAlt: string
  logoWidth?: number
  logoHeight?: number
}

export type CoalitionSectionProps = {
  heading: string
  partners: CoalitionPartner[]
}

function logoDimension(value: number | undefined, fallback: number) {
  return typeof value === 'number' && value > 0 ? value : fallback
}

export function CoalitionSection({heading, partners}: CoalitionSectionProps) {
  if (partners.length === 0) {
    return null
  }

  return (
    <section className="bg-background">
      <div className="mx-auto w-full max-w-6xl px-6 py-10 md:px-12 md:py-14">
        <h2 className="section-label-heading text-muted-foreground mb-5 md:mb-7">{heading}</h2>
        <div className="-mx-6 overflow-x-auto px-6 md:mx-0 md:px-0">
          <ul className="flex w-max min-w-full items-center gap-6 pb-2 md:justify-center md:gap-8">
            {partners.map((partner) => (
              <li key={partner.href}>
                <a
                  href={partner.href}
                  aria-label={partner.ariaLabel}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center"
                >
                  <Image
                    src={partner.logoSrc}
                    alt={partner.logoAlt}
                    width={logoDimension(partner.logoWidth, 240)}
                    height={logoDimension(partner.logoHeight, 120)}
                    className="h-11 w-auto max-w-none object-contain md:h-14"
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

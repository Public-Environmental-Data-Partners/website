import type {ByTheNumbersSectionProps} from '@/lib/mappers/by-the-numbers-section'

/**
 * Homepage “By the numbers”: kicker + stat cards (light green surface, light-beige offset shadow).
 * Layout: stack on small screens, row on `md+` per design brief.
 */
export function ByTheNumbersSection({kicker, stats}: ByTheNumbersSectionProps) {
  if (stats.length === 0) {
    return null
  }

  return (
    <section className="bg-background" aria-labelledby="by-the-numbers-heading">
      <div className="mx-auto w-full max-w-site px-6 py-10 md:px-12 md:py-14">
        <h2
          id="by-the-numbers-heading"
          className="section-label-heading text-muted-foreground mb-5 md:mb-7"
        >
          {kicker}
        </h2>
        <ul className="flex flex-col items-start gap-10 pl-6 pb-6 md:w-full md:flex-row md:items-start md:justify-between md:gap-0 md:pl-0 md:pb-8">
          {stats.map((stat, index) => (
            <li key={`${stat.value}-${stat.label}-${index}`} className="shrink-0 md:first:ml-6">
              <div
                className="bg-light-green w-max max-w-full rounded-none px-5 py-6 text-center md:px-7 md:py-8"
                style={{
                  boxShadow: '-1.5rem 1.5rem 0 0 var(--light-beige)',
                }}
              >
                <p
                  className="font-sans font-medium italic leading-[0.95] tracking-tight text-foreground"
                  style={{fontSize: 'clamp(2.75rem, 11vw, 7.5rem)'}}
                >
                  {stat.value}
                </p>
                <p className="text-foreground mt-3 text-xl font-medium leading-snug md:mt-4">
                  {stat.label}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

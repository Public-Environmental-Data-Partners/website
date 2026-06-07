type QuoteBlockProps = {
  quote: string
  attribution?: string | null
}

export function QuoteBlock({quote, attribution}: QuoteBlockProps) {
  const trimmedQuote = quote.trim()
  if (!trimmedQuote) {
    return null
  }

  const trimmedAttribution = attribution?.trim()

  return (
    <figure className="bg-light-green my-8 px-6 py-8 md:px-8 md:py-10">
      <blockquote className="text-forest font-serif text-[1.875rem] font-medium italic leading-none">
        &ldquo;{trimmedQuote}&rdquo;
      </blockquote>
      {trimmedAttribution ? (
        <figcaption className="text-forest text-body-lg mt-6 text-right font-semibold uppercase leading-none">
          —{trimmedAttribution}
        </figcaption>
      ) : null}
    </figure>
  )
}

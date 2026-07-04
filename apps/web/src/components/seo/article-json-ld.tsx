type ArticleJsonLdProps = {
  data: Record<string, unknown>
}

export function ArticleJsonLd({data}: ArticleJsonLdProps) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(data)}} />
  )
}

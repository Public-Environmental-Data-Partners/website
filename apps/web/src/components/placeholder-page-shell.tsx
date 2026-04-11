/** Thin layout for routes until CMS copy and sections exist (web-build-plan §f). */
export function PlaceholderPageShell({
  title,
  description = 'Content for this page is not yet published. Check back soon.',
}: {
  title: string
  description?: string
}) {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-4 px-6 py-16 md:px-12">
      <h1 className="text-foreground text-3xl font-semibold tracking-tight md:text-4xl">{title}</h1>
      <p className="text-muted-foreground max-w-prose text-lg leading-relaxed">{description}</p>
    </div>
  )
}

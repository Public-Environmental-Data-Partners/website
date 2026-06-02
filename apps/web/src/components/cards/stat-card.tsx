export type StatCardProps = {
  value: string
  label: string
}

/** By-the-numbers stat surface: light green plate + beige offset shadow. */
export function StatCard({value, label}: StatCardProps) {
  return (
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
        {value}
      </p>
      <p className="text-foreground mt-3 text-xl font-medium leading-snug md:mt-4">{label}</p>
    </div>
  )
}

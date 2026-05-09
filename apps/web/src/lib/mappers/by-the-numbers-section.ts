export type ByTheNumbersStatProps = {
  value: string
  label: string
}

export type ByTheNumbersSectionProps = {
  kicker: string
  stats: ByTheNumbersStatProps[]
}

type StatGroq = {
  _key?: string | null
  value?: string | null
  label?: string | null
}

export type ByTheNumbersSectionFields = {
  kicker?: string | null
  stats?: StatGroq[] | null
}

export function mapByTheNumbersSectionToProps(
  data: ByTheNumbersSectionFields | null | undefined,
): ByTheNumbersSectionProps | null {
  const kicker = data?.kicker?.trim()
  if (!kicker) {
    return null
  }
  const stats: ByTheNumbersStatProps[] = []
  for (const row of data?.stats ?? []) {
    if (!row) {
      continue
    }
    const value = row.value?.trim()
    const label = row.label?.trim()
    if (value && label) {
      stats.push({value, label})
    }
  }
  if (stats.length === 0) {
    return null
  }
  return {kicker, stats}
}

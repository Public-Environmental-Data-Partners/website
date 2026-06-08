export type EmbedAspect = 'video' | 'fixed'

export type ResolvedEmbed = {
  providerId: string
  providerLabel: string
  src: string
  title: string
  aspect: EmbedAspect
  fixedHeight?: number
}

export type EmbedProvider = {
  id: string
  label: string
  matches: (url: URL) => boolean
  resolve: (url: URL) => Omit<ResolvedEmbed, 'providerId' | 'providerLabel'> | null
}

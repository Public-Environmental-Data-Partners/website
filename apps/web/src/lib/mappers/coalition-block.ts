import type {CoalitionSectionProps} from '@/components/home/coalition-section'

type SanityLogo = {
  alt?: string | null
  asset?: {
    url?: string | null
    metadata?: {
      dimensions?: {
        width?: number | null
        height?: number | null
      } | null
    } | null
  } | null
}

type SanityPartner = {
  name?: string | null
  url?: string | null
  ariaLabel?: string | null
  logo?: SanityLogo | null
}

type CoalitionSource = {
  coalitionHeading?: string | null
  coalitionPartners?: SanityPartner[] | null
} | null

export function mapCoalitionBlockToProps(data: CoalitionSource): CoalitionSectionProps | null {
  const partners = (data?.coalitionPartners ?? [])
    .map((partner) => {
      const name = partner?.name?.trim()
      const href = partner?.url?.trim()
      const logoSrc = partner?.logo?.asset?.url?.trim()

      if (!name || !href || !logoSrc) {
        return null
      }

      const dimensions = partner.logo?.asset?.metadata?.dimensions
      return {
        name,
        href,
        ariaLabel: partner.ariaLabel?.trim() || name,
        logoSrc,
        logoAlt: partner.logo?.alt?.trim() || name,
        logoWidth: dimensions?.width ?? undefined,
        logoHeight: dimensions?.height ?? undefined,
      }
    })
    .filter((partner): partner is NonNullable<typeof partner> => partner !== null)

  if (partners.length === 0) {
    return null
  }

  return {
    heading: data?.coalitionHeading?.trim() || 'Our coalition',
    partners,
  }
}

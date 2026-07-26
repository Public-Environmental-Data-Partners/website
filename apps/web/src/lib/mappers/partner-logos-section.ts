import type {PartnerLogosSectionProps} from '@/components/sections/partner-logos-section'

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

export type PartnerLogosSectionFields = {
  sectionHeading?: string | null
  partners?: SanityPartner[] | null
  useMarquee?: boolean | null
}

export function mapPartnerLogosSectionToProps(
  data: PartnerLogosSectionFields | null | undefined,
): PartnerLogosSectionProps | null {
  const partners = (data?.partners ?? [])
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
    sectionHeading: data?.sectionHeading?.trim() || 'Our partners',
    partners,
    useMarquee: data?.useMarquee === true,
  }
}

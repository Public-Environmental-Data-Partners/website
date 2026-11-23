import {type ContentLinkGroq, resolveContentLink} from '@/lib/content-link'

/** Icon fields this mapper reads from a Sanity image. */
type SocialIconFields = {
  asset?: {
    url?: string | null
  } | null
} | null

/** One social row as stored on `siteFooter.socialLinks`. */
export type FooterSocialLinkFields = {
  _key?: string | null
  label?: string | null
  icon?: SocialIconFields
  link?: ContentLinkGroq | null
}

/** Social row ready for the footer. */
export type FooterSocialLink = {
  key: string
  label: string
  href: string
  external: boolean
  iconSrc: string
}

/** Maps CMS social rows. A missing or empty list renders no icons. */
export function mapFooterSocialLinks(
  links: FooterSocialLinkFields[] | null | undefined,
): FooterSocialLink[] {
  if (links == null) {
    return []
  }

  const mapped: FooterSocialLink[] = []
  for (const [index, entry] of links.entries()) {
    const link = mapFooterSocialLink(entry, index)
    if (link) {
      mapped.push(link)
    }
  }
  return mapped
}

function mapFooterSocialLink(
  entry: FooterSocialLinkFields | null,
  index: number,
): FooterSocialLink | null {
  if (!entry) {
    return null
  }

  const label = entry.label?.trim()
  const iconSrc = entry.icon?.asset?.url?.trim()
  const resolved = resolveContentLink(entry.link)
  if (!label || !iconSrc || !resolved) {
    return null
  }

  const key = entry._key?.trim() || `social-${index}`
  return {
    key,
    label,
    href: resolved.href,
    external: resolved.external,
    iconSrc,
  }
}

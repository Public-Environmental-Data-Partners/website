import Image from 'next/image'
import Link from 'next/link'
import type {ReactNode} from 'react'

import type {FooterSocialLink} from '@/lib/mappers/footer-social-links'
import {cn} from '@/lib/utils'

function IconBox({className, children}: {className?: string; children: ReactNode}) {
  return (
    <span
      className={cn('inline-flex size-[30px] items-center justify-center text-current', className)}
      aria-hidden
    >
      {children}
    </span>
  )
}

const socialListClassName =
  'grid w-[180px] grid-cols-4 justify-items-start gap-x-[20px] gap-y-[20px] text-footer-foreground'

const socialLinkClassName =
  'text-footer-foreground hover:opacity-80 focus-visible:ring-ring inline-flex rounded-md focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--footer)]'

function SocialAnchor({
  href,
  label,
  external,
  children,
}: {
  href: string
  label: string
  external?: boolean
  children: ReactNode
}) {
  return (
    <Link
      href={href}
      {...(external ? {target: '_blank', rel: 'noopener noreferrer'} : {})}
      aria-label={label}
      className={socialLinkClassName}
    >
      {children}
    </Link>
  )
}

/**
 * Social icons from the Site footer document. A 180px grid fits four 30px icons
 * per row (20px gaps); further icons wrap, left aligned. An empty list renders nothing.
 */
export function FooterSocialLinks({
  links,
  className,
}: {
  links: FooterSocialLink[]
  className?: string
}) {
  if (!links?.length) {
    return null
  }

  return (
    <ul className={cn(socialListClassName, className)}>
      {links.map(({key, href, label, external, iconSrc}) => (
        <li key={key} className="shrink-0">
          <SocialAnchor href={href} label={label} external={external}>
            <IconBox>
              <Image
                src={iconSrc}
                alt=""
                width={20}
                height={20}
                className="size-5 object-contain"
                unoptimized={iconSrc.split('?')[0]?.endsWith('.svg') ?? false}
              />
            </IconBox>
          </SocialAnchor>
        </li>
      ))}
    </ul>
  )
}

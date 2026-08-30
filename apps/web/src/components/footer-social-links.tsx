/*
 * Brand SVG paths for Bluesky match Simple Icons v11.4.0 (CC0).
 * https://github.com/simple-icons/simple-icons
 */
import Link from 'next/link'
import type {ComponentType, ReactNode} from 'react'

import {cn} from '@/lib/utils'

type SocialEntry = {
  href: string
  label: string
  Icon: ComponentType<{className?: string}>
  external?: boolean
}

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

/** Bluesky mark, path from Simple Icons (CC0), fill `currentColor`. */
function BlueskyIcon({className}: {className?: string}) {
  return (
    <IconBox className={className}>
      <svg
        viewBox="0 0 24 24"
        className="size-5"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 0 1-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.861-.902-2.206-.659-.298-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8Z" />
      </svg>
    </IconBox>
  )
}

function LinkedInIcon({className}: {className?: string}) {
  return (
    <IconBox className={className}>
      <svg
        viewBox="0 0 24 24"
        className="size-5"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zM7.119 20.452H3.555V9h3.564v11.452z" />
      </svg>
    </IconBox>
  )
}

function GitHubIcon({className}: {className?: string}) {
  return (
    <IconBox className={className}>
      <svg
        viewBox="0 0 24 24"
        className="size-5"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    </IconBox>
  )
}

function MailIcon({className}: {className?: string}) {
  return (
    <IconBox className={className}>
      <svg
        viewBox="0 0 24 24"
        className="size-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    </IconBox>
  )
}

const socialLinks: SocialEntry[] = [
  {
    href: 'https://bsky.app/profile/publicenvirodata.bsky.social',
    label: 'PEDP on Bluesky',
    Icon: BlueskyIcon,
    external: true,
  },
  {
    href: 'https://www.linkedin.com/company/public-environmental-data-project/',
    label: 'PEDP on LinkedIn',
    Icon: LinkedInIcon,
    external: true,
  },
  {
    href: 'https://github.com/Public-Environmental-Data-Partners',
    label: 'PEDP on GitHub',
    Icon: GitHubIcon,
    external: true,
  },
  {
    href: 'mailto:hello@publicenvirodata.org',
    label: 'Email PEDP',
    Icon: MailIcon,
  },
]

/** Social / contact icons — Figma row 180×30. */
export function FooterSocialLinks({className}: {className?: string}) {
  return (
    <ul
      className={cn(
        'flex h-[30px] w-[180px] items-center justify-between text-footer-foreground',
        className,
      )}
    >
      {socialLinks.map(({href, label, Icon, external}) => (
        <li key={label}>
          <Link
            href={href}
            {...(external ? {target: '_blank', rel: 'noopener noreferrer'} : {})}
            aria-label={label}
            className="text-footer-foreground hover:opacity-80 focus-visible:ring-ring rounded-md focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--footer)]"
          >
            <Icon />
          </Link>
        </li>
      ))}
    </ul>
  )
}

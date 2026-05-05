/*
 * Brand SVG paths for Bluesky, Facebook, and Threads match Simple Icons v11.4.0 (CC0).
 * https://github.com/simple-icons/simple-icons
 */
import Link from 'next/link'
import type {ComponentType, ReactNode} from 'react'

import {cn} from '@/lib/utils'

type SocialEntry = {
  href: string
  label: string
  Icon: ComponentType<{className?: string}>
}

function IconBox({className, children}: {className?: string; children: ReactNode}) {
  return (
    <span
      className={cn('inline-flex size-9 items-center justify-center text-current', className)}
      aria-hidden
    >
      {children}
    </span>
  )
}

/** Bluesky mark — path from Simple Icons (CC0), fill `currentColor`. */
function BlueskyIcon({className}: {className?: string}) {
  return (
    <IconBox className={className}>
      <svg viewBox="0 0 24 24" className="size-6" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 0 1-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.861-.902-2.206-.659-.298-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8Z" />
      </svg>
    </IconBox>
  )
}

function LinkedInIcon({className}: {className?: string}) {
  return (
    <IconBox className={className}>
      <svg viewBox="0 0 24 24" className="size-6" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zM7.119 20.452H3.555V9h3.564v11.452z" />
      </svg>
    </IconBox>
  )
}

function GitHubIcon({className}: {className?: string}) {
  return (
    <IconBox className={className}>
      <svg viewBox="0 0 24 24" className="size-6" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    </IconBox>
  )
}

/** Facebook mark — path from Simple Icons (CC0), fill `currentColor`. */
function FacebookIcon({className}: {className?: string}) {
  return (
    <IconBox className={className}>
      <svg viewBox="0 0 24 24" className="size-6" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
      </svg>
    </IconBox>
  )
}

/** Threads mark — path from Simple Icons (CC0), fill `currentColor`. */
function ThreadsIcon({className}: {className?: string}) {
  return (
    <IconBox className={className}>
      <svg viewBox="0 0 24 24" className="size-6" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 0 1 3.02.142c-.126-.742-.375-1.332-.75-1.757-.513-.586-1.308-.883-2.359-.89h-.029c-.844 0-1.992.232-2.721 1.32L7.734 7.847c.98-1.454 2.568-2.256 4.478-2.256h.044c3.194.02 5.097 1.975 5.287 5.388.108.046.216.094.321.142 1.49.7 2.58 1.761 3.154 3.07.797 1.82.871 4.79-1.548 7.158-1.85 1.81-4.094 2.628-7.277 2.65Zm1.003-11.69c-.242 0-.487.007-.739.021-1.836.103-2.98.946-2.916 2.143.067 1.256 1.452 1.839 2.784 1.767 1.224-.065 2.818-.543 3.086-3.71a10.5 10.5 0 0 0-2.215-.221z" />
      </svg>
    </IconBox>
  )
}

function YouTubeIcon({className}: {className?: string}) {
  return (
    <IconBox className={className}>
      <svg viewBox="0 0 24 24" className="size-6" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    </IconBox>
  )
}

const socialLinks: SocialEntry[] = [
  {href: 'https://bsky.app', label: 'PEDP on Bluesky', Icon: BlueskyIcon},
  {href: 'https://www.linkedin.com', label: 'PEDP on LinkedIn', Icon: LinkedInIcon},
  {href: 'https://github.com', label: 'PEDP on GitHub', Icon: GitHubIcon},
  {href: 'https://www.facebook.com', label: 'PEDP on Facebook', Icon: FacebookIcon},
  {href: 'https://www.threads.com', label: 'PEDP on Threads', Icon: ThreadsIcon},
  {href: 'https://www.youtube.com', label: 'PEDP on YouTube', Icon: YouTubeIcon},
]

export function FooterSocialLinks({className}: {className?: string}) {
  return (
    <ul className={cn('flex flex-wrap items-center gap-2', className)}>
      {socialLinks.map(({href, label, Icon}) => (
        <li key={label}>
          <Link
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="text-footer-foreground/90 hover:text-footer-foreground focus-visible:ring-ring rounded-md focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--footer)]"
          >
            <Icon />
          </Link>
        </li>
      ))}
    </ul>
  )
}

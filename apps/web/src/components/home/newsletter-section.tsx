'use client'

import {Mail} from 'lucide-react'
import {useId, useState} from 'react'

import type {NewsletterSectionProps} from '@/lib/mappers/newsletter-section'
import {cn} from '@/lib/utils'

export type {NewsletterSectionProps}

/*
 * Layout note: the newsletter section’s visual design relies on fairly intricate CSS (full-bleed
 * breakout, `max-lg` vs `lg` width rules, viewport-based `calc()` for the side gutter, absolute
 * positioning, stacked flex bands on the bottom strip, etc.). That complexity is somewhat
 * fragile—small layout or token changes can misalign edges or heights—so treat edits here as
 * higher risk and prefer documenting any non-obvious geometry when changing this file.
 */

/** Newsletter prompt line: serif stack reads closer to the reference mock than Figtree-alone `font-serif`. */
const newsletterPromptSerif =
  "font-[Georgia,Cambria,'Times_New_Roman',Times,serif] font-normal tracking-tight text-navy"

function fadeSlot(active: boolean) {
  return cn(
    'col-start-1 row-start-1 min-w-0 transition-opacity duration-300 ease-out motion-reduce:transition-none',
    active ? 'opacity-100' : 'pointer-events-none opacity-0',
  )
}

export function NewsletterSection({
  heading,
  body,
  emailPlaceholder,
  submitLabel,
}: NewsletterSectionProps) {
  const headingId = useId()
  const emailId = useId()
  const [email, setEmail] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [success, setSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function submitNewsletter() {
    setError(null)
    setSubmitting(true)
    try {
      const res = await fetch('/api/newsletter-signup', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email, website: honeypot}),
      })
      const data = (await res.json()) as {ok?: boolean; error?: string}
      if (!res.ok || !data.ok) {
        setError(data.error ?? 'Something went wrong. Please try again.')
        return
      }
      setSuccess(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section
      className="bg-off-white dark:bg-background"
      {...(success ? {'aria-label': 'Newsletter'} : {'aria-labelledby': headingId})}
    >
      <div
        className={cn(
          'relative z-10 pb-0 pt-10 md:pb-0 md:pt-14',
          'max-lg:left-1/2 max-lg:w-screen max-lg:max-w-none max-lg:-translate-x-1/2 max-lg:px-0',
          'lg:mx-auto lg:w-full lg:max-w-[min(100%,calc(var(--max-width-site)*0.75))] lg:translate-x-0 lg:px-[2.625rem] lg:pb-0 lg:pl-[5.25rem] lg:pr-0',
        )}
      >
        <div className="bg-light-blue shadow-sm dark:bg-light-blue dark:shadow-none max-lg:rounded-none">
          <div className="flex flex-col gap-8 px-[2.625rem] py-8 md:flex-row md:items-center md:gap-10 md:px-[4.375rem] md:py-10 lg:gap-12 lg:px-[5.25rem] lg:py-12">
            <div className="flex shrink-0 justify-center md:justify-start">
              <Mail
                strokeWidth={1.35}
                className="text-navy size-20 md:size-[5.5rem] lg:size-24"
                aria-hidden
              />
            </div>

            <div className="min-w-0 flex-1">
              <div className="grid [&>*]:col-start-1 [&>*]:row-start-1 [&>*]:min-w-0">
                <div className={fadeSlot(!success)} aria-hidden={success}>
                  <h2
                    id={headingId}
                    className={cn(
                      newsletterPromptSerif,
                      'text-xl leading-snug md:text-2xl lg:text-[1.65rem]',
                    )}
                  >
                    {heading}
                  </h2>
                  {body ? (
                    <p className="font-sans text-navy/85 mt-2 max-w-2xl text-sm leading-relaxed md:text-base">
                      {body}
                    </p>
                  ) : null}

                  <form
                    className={body ? 'mt-4 md:mt-5' : 'mt-5 md:mt-6'}
                    onSubmit={(event) => {
                      event.preventDefault()
                      void submitNewsletter()
                    }}
                    noValidate
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch sm:gap-2">
                      <label htmlFor={emailId} className="sr-only">
                        Email
                      </label>
                      <input
                        id={emailId}
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        disabled={submitting}
                        placeholder={emailPlaceholder}
                        onChange={(e) => setEmail(e.target.value)}
                        className={cn(
                          'border-sky-foreground/15 bg-white text-foreground placeholder:text-muted-foreground',
                          'focus-visible:ring-navy min-h-11 min-w-0 flex-1 rounded-[4px] border px-3 py-2 text-base',
                          'focus-visible:ring-2 focus-visible:outline-none',
                          'disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/20 dark:bg-card dark:text-card-foreground',
                        )}
                      />
                      <label className="sr-only" htmlFor={`${emailId}-website`}>
                        Leave blank
                      </label>
                      <input
                        id={`${emailId}-website`}
                        name="website"
                        tabIndex={-1}
                        autoComplete="off"
                        value={honeypot}
                        onChange={(e) => setHoneypot(e.target.value)}
                        className="absolute h-px w-px -translate-x-[9999px] opacity-0"
                        aria-hidden
                      />
                      <button
                        type="submit"
                        disabled={submitting}
                        className={cn(
                          'bg-navy text-white hover:bg-navy/90',
                          'focus-visible:ring-navy min-h-11 shrink-0 rounded-[4px] px-6 font-sans text-base font-semibold',
                          'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                          'focus-visible:ring-offset-light-blue dark:focus-visible:ring-offset-light-blue',
                          'disabled:pointer-events-none disabled:opacity-50',
                          'sm:min-w-[9.5rem]',
                        )}
                      >
                        {submitting ? 'Sending...' : submitLabel}
                      </button>
                    </div>
                    {error ? (
                      <p className="text-destructive mt-2 text-sm" role="alert">
                        {error}
                      </p>
                    ) : null}
                  </form>
                </div>

                <div
                  className={fadeSlot(success)}
                  role="status"
                  aria-live="polite"
                  aria-hidden={!success}
                >
                  <p className={cn(newsletterPromptSerif, 'text-lg md:text-xl')}>
                    Thank you for signing up.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="pointer-events-none absolute top-12 bottom-0 left-full z-0 hidden w-[calc((100vw-min(100vw,calc(var(--max-width-site)*0.75)))/2)] flex-col lg:top-14 lg:flex"
          aria-hidden
        >
          <div className="min-h-0 flex-[1] bg-off-white dark:bg-background" />
          <div className="min-h-0 flex-[3] bg-dark-blue" />
        </div>
      </div>

      <div
        className="pointer-events-none relative left-1/2 mb-10 flex min-h-7 w-screen max-w-none -translate-x-1/2 md:mb-14 md:min-h-8 lg:min-h-16"
        aria-hidden
      >
        <div className="min-h-0 min-w-0 max-lg:flex-[1] bg-off-white dark:bg-background lg:flex-1" />
        <div className="min-h-0 min-w-0 max-lg:flex-[3] bg-dark-blue lg:flex-1" />
      </div>
    </section>
  )
}

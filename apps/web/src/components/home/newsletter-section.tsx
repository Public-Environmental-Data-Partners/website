'use client'

import Image from 'next/image'
import {useId, useState} from 'react'

import {SectionBand, SiteShell} from '@/components/layout'
import {Button} from '@/components/ui/button'
import type {NewsletterSectionProps} from '@/lib/mappers/newsletter-section'
import {cn} from '@/lib/utils'

export type {NewsletterSectionProps}

const ENVELOPE_SRC = '/brand/newsletter/envelope.svg'

function fadeSlot(active: boolean) {
  return cn(
    'col-start-1 row-start-1 min-w-0 transition-opacity duration-300 ease-out motion-reduce:transition-none',
    active ? 'opacity-100' : 'pointer-events-none opacity-0',
  )
}

/**
 * Simple forest newsletter band.
 * Mobile/tablet: stacked. Desktop (`lg+`): icon | copy | input + Subscribe.
 */
export function NewsletterSection({
  kicker,
  heading,
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
    <SectionBand
      className="bg-forest"
      {...(success ? {'aria-label': 'Newsletter'} : {'aria-labelledby': headingId})}
    >
      <SiteShell>
        <div className="grid [&>*]:col-start-1 [&>*]:row-start-1 [&>*]:min-w-0">
          <div className={fadeSlot(!success)} aria-hidden={success}>
            <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-12">
              {/* Mobile/tablet: kicker + small icon. Desktop: large icon. */}
              <div className="flex items-center justify-between gap-4 lg:contents">
                <p className="font-sans text-2xl leading-none font-semibold tracking-normal text-light-green uppercase lg:hidden">
                  {kicker}
                </p>
                <Image
                  src={ENVELOPE_SRC}
                  alt=""
                  width={200}
                  height={136}
                  className="h-7 w-10 shrink-0 object-contain lg:h-auto lg:w-[200px]"
                  unoptimized
                />
              </div>

              <div className="flex min-w-0 flex-1 flex-col gap-8 lg:gap-3">
                <p className="hidden font-sans text-2xl leading-none font-bold tracking-normal text-light-green uppercase lg:block">
                  {kicker}
                </p>

                <form
                  className="flex flex-col items-center gap-6 lg:flex-row lg:items-start lg:gap-6"
                  onSubmit={(event) => {
                    event.preventDefault()
                    void submitNewsletter()
                  }}
                  noValidate
                >
                  <h2
                    id={headingId}
                    className="text-center font-serif text-[2rem] leading-[1.875rem] font-semibold text-light-green lg:shrink-0 lg:pt-3 lg:text-left"
                  >
                    {heading}
                  </h2>
                  <div className="flex w-full max-w-[29.375rem] flex-col items-center gap-4 lg:min-w-0 lg:flex-1 lg:items-stretch">
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
                        'h-[60px] w-full rounded-[4px] border-0 bg-off-white px-4',
                        'font-sans text-base text-foreground placeholder:text-muted-foreground',
                        'focus-visible:ring-light-green focus-visible:ring-2 focus-visible:outline-none',
                        'disabled:cursor-not-allowed disabled:opacity-60',
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
                    <Button
                      type="submit"
                      size="cta"
                      disabled={submitting}
                      className="shrink-0 border-transparent bg-light-green text-forest hover:bg-light-green/90 lg:self-center"
                    >
                      {submitting ? 'Sending...' : submitLabel}
                    </Button>
                    {error ? (
                      <p
                        className="text-light-green w-full text-center text-sm lg:text-left"
                        role="alert"
                      >
                        {error}
                      </p>
                    ) : null}
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div
            className={fadeSlot(success)}
            role="status"
            aria-live="polite"
            aria-hidden={!success}
          >
            <p className="text-center font-serif text-[2rem] leading-[1.875rem] font-semibold text-light-green lg:text-left">
              Thank you for signing up.
            </p>
          </div>
        </div>
      </SiteShell>
    </SectionBand>
  )
}

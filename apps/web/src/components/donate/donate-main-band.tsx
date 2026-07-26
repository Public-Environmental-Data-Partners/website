import {DonateFormSection} from '@/components/donate/donate-form-section'
import {DonateInfoBox} from '@/components/donate/donate-info-box'
import {Grid12, SectionBand, SiteShell} from '@/components/layout'
import type {DonateFormSectionProps, DonateInfoSectionProps} from '@/lib/mappers/donate-sections'

type DonateMainBandProps = {
  pageTitle: string
  form: DonateFormSectionProps | null
  info: DonateInfoSectionProps | null
}

/**
 * Top donate band: page title (sr-only for outline) + form | info grid.
 * Desktop: form sits in cols 2–5 (centered in the first half); info in cols 7–12.
 * Mobile: full width, form then info.
 */
export function DonateMainBand({pageTitle, form, info}: DonateMainBandProps) {
  if (!form && !info) {
    return null
  }

  return (
    <SectionBand className="bg-cream">
      <SiteShell padding="grid" className="pt-10 pb-12 md:pt-14 md:pb-16">
        <h1 className="sr-only">{pageTitle}</h1>
        <Grid12 className="items-start gap-y-10 lg:gap-y-0">
          {form ? (
            <div className="col-span-12 min-w-0 lg:col-span-4 lg:col-start-2">
              <DonateFormSection {...form} />
            </div>
          ) : null}
          {info ? (
            <div className="col-span-12 min-w-0 lg:col-span-6 lg:col-start-7">
              <DonateInfoBox {...info} />
            </div>
          ) : null}
        </Grid12>
      </SiteShell>
    </SectionBand>
  )
}

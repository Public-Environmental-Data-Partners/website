import type {PortableTextBlock} from '@portabletext/react'
import type {Metadata} from 'next'

import {HighlightBannerSection} from '@/components/home/highlight-banner-section'
import {SectionBand, SiteShell} from '@/components/layout'

import windmillsImage from '../article-figure/windmills.png'

export const metadata: Metadata = {
  title: 'Highlight banner dev',
  robots: {index: false, follow: false},
}

const DEV_IMAGE = {
  src: windmillsImage.src,
  alt: 'Wind turbines on a green hillside under a pale sky',
  width: windmillsImage.width,
  height: windmillsImage.height,
} as const

function paragraph(key: string, text: string): PortableTextBlock {
  return {
    _type: 'block',
    _key: key,
    style: 'normal',
    markDefs: [],
    children: [{_type: 'span', _key: `${key}a`, text, marks: []}],
  }
}

const CTA = {ctaLabel: 'Read More', ctaHref: '/'} as const

const VARIANTS: Array<{
  label: string
  note: string
  sectionHeading: string
  heading: string
  body: PortableTextBlock[]
}> = [
  {
    label: 'Short',
    note: 'One-line heading. Extra space should sit equally between section heading, heading, and CTA.',
    sectionHeading: 'MADE POSSIBLE',
    heading: 'A short title.',
    body: [paragraph('short', '2,212 studies used disappearing federal climate justice tools.')],
  },
  {
    label: 'Design length',
    note: 'Matches the Figma-style title. Gaps should still fill the image height.',
    sectionHeading: 'HIGHLIGHT BANNER',
    heading: 'This is a example highlight title.',
    body: [
      paragraph(
        'design',
        '2,212 studies used disappearing federal climate justice tools. We analyzed them all.',
      ),
    ],
  },
  {
    label: 'Two-line wrap',
    note: 'Heading wraps to two lines. Gaps should shrink but CTA should still meet the image bottom.',
    sectionHeading: 'MADE POSSIBLE',
    heading: '2,212 studies used disappearing federal climate justice tools.',
    body: [paragraph('wrap', 'We analyzed them all.')],
  },
  {
    label: 'Packed',
    note: 'Longer heading. Spacing should be near the 16px floor, still aligned with the image.',
    sectionHeading: 'MADE POSSIBLE',
    heading:
      '2,212 studies used disappearing federal climate justice tools. We analyzed them all.',
    body: [
      paragraph(
        'packed',
        'Federal screening tools used in environmental justice research are disappearing. PEDP archived the studies and mapped what they measured.',
      ),
    ],
  },
  {
    label: 'Overflow',
    note: 'Heading taller than the image. Gaps stay at the minimum and the copy column extends below the image.',
    sectionHeading: 'MADE POSSIBLE',
    heading:
      '2,212 studies used disappearing federal climate justice tools. We analyzed them all, including community-scale screening, cumulative impacts, and public-health findings that would otherwise vanish with the underlying datasets.',
    body: [
      paragraph(
        'overflow1',
        'This desktop body is also long, so wide viewports can check the same shrink-then-grow behavior.',
      ),
      paragraph(
        'overflow2',
        'A second paragraph confirms the column grows downward instead of overlapping the button or the image.',
      ),
    ],
  },
]

export default function HighlightBannerDevPage() {
  return (
    <>
      <SectionBand className="bg-background py-10">
        <SiteShell>
          <p className="text-muted-foreground text-sm uppercase tracking-wide">Dev only</p>
          <h1 className="mt-2 font-sans text-2xl font-medium">Highlight banner lengths</h1>
          <p className="text-muted-foreground mt-2 max-w-3xl text-sm">
            Resize to tablet (768–1023px). Column 1 is the image (top) and the button. Column 2 is
            section heading, heading, and body. On desktop the heading is hidden and the button moves
            under the copy.
          </p>
        </SiteShell>
      </SectionBand>
      {VARIANTS.map((variant) => (
        <div key={variant.label}>
          <SectionBand className="bg-background py-6">
            <SiteShell>
              <h2 className="font-sans text-lg font-semibold">{variant.label}</h2>
              <p className="text-muted-foreground mt-1 max-w-3xl text-sm">{variant.note}</p>
            </SiteShell>
          </SectionBand>
          <HighlightBannerSection
            headingId={`highlight-banner-${variant.label.replace(/\s+/g, '-').toLowerCase()}`}
            sectionHeading={variant.sectionHeading}
            heading={variant.heading}
            body={variant.body}
            image={DEV_IMAGE}
            {...CTA}
          />
        </div>
      ))}
    </>
  )
}

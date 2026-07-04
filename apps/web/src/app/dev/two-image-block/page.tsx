import type {PortableTextBlock} from '@portabletext/react'
import type {Metadata} from 'next'

import {TwoImageBlock} from '@/components/content/two-image-block'
import {Grid12, SectionBand, SiteShell} from '@/components/layout'

import windmillsImage from '../article-figure/windmills.png'

export const metadata: Metadata = {
  title: 'Two-image block dev',
  robots: {index: false, follow: false},
}

const DEV_IMAGE = {
  src: windmillsImage.src,
  alt: 'Wind turbines on a green hillside under a pale sky',
  width: windmillsImage.width,
  height: windmillsImage.height,
} as const

const LEFT_CAPTION: PortableTextBlock[] = [
  {
    _type: 'block',
    _key: 'left-cap',
    style: 'normal',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: 'left-cap-span',
        text: 'First image caption with bold emphasis on policy.',
        marks: ['strong'],
      },
    ],
  },
]

const RIGHT_CAPTION: PortableTextBlock[] = [
  {
    _type: 'block',
    _key: 'right-cap',
    style: 'normal',
    markDefs: [
      {
        _key: 'link1',
        _type: 'link',
        href: 'https://example.com',
      },
    ],
    children: [
      {
        _type: 'span',
        _key: 'right-cap-a',
        text: 'Second caption with a ',
        marks: [],
      },
      {
        _type: 'span',
        _key: 'right-cap-b',
        text: 'link',
        marks: ['link1'],
      },
      {
        _type: 'span',
        _key: 'right-cap-c',
        text: ' for QA.',
        marks: [],
      },
    ],
  },
]

export default function TwoImageBlockDevPage() {
  return (
    <SectionBand className="overflow-x-clip bg-white py-12">
      <SiteShell>
        <Grid12 data-slot="article-body-grid">
          <div data-slot="article-body-block" className="col-span-12 min-w-0">
            <p className="text-muted-foreground mb-4 text-sm">
              Two images — 6+6 @ tablet/desktop, stacked @ mobile
            </p>
            <TwoImageBlock
              items={[
                {
                  image: DEV_IMAGE,
                  photoCredit: 'Photographer One',
                  caption: LEFT_CAPTION,
                },
                {
                  image: DEV_IMAGE,
                  photoCredit: 'Photographer Two',
                  caption: RIGHT_CAPTION,
                },
              ]}
            />
          </div>
        </Grid12>
      </SiteShell>
    </SectionBand>
  )
}

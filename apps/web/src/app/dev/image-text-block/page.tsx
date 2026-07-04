import type {PortableTextBlock} from '@portabletext/react'
import type {Metadata} from 'next'

import {ImageTextBlock} from '@/components/content/image-text-block'
import {Grid12, SectionBand, SiteShell} from '@/components/layout'

import windmillsImage from '../article-figure/windmills.png'

export const metadata: Metadata = {
  title: 'Image-text block dev',
  robots: {index: false, follow: false},
}

const DEV_IMAGE = {
  src: windmillsImage.src,
  alt: 'Wind turbines on a green hillside under a pale sky',
  width: windmillsImage.width,
  height: windmillsImage.height,
} as const

const SAMPLE_BODY: PortableTextBlock[] = [
  {
    _type: 'block',
    _key: 'body1',
    style: 'normal',
    children: [
      {
        _type: 'span',
        _key: 'body1a',
        text: 'Supporting copy beside the figure. ',
        marks: [],
      },
      {
        _type: 'span',
        _key: 'body1b',
        text: 'Bold phrase',
        marks: ['strong'],
      },
      {
        _type: 'span',
        _key: 'body1c',
        text: ' and a ',
        marks: [],
      },
      {
        _type: 'span',
        _key: 'body1d',
        text: 'link',
        marks: ['link1'],
      },
      {
        _type: 'span',
        _key: 'body1e',
        text: ' for layout QA at multiple breakpoints.',
        marks: [],
      },
    ],
    markDefs: [
      {
        _key: 'link1',
        _type: 'link',
        href: 'https://example.com',
      },
    ],
  },
  {
    _type: 'block',
    _key: 'body2',
    style: 'normal',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: 'body2a',
        text: 'Second paragraph to check top alignment and column width.',
        marks: [],
      },
    ],
  },
]

function DevImageTextRow({imagePosition}: {imagePosition: 'left' | 'right'}) {
  return (
    <div data-slot="article-body-block" className="col-span-12 min-w-0">
      <p className="text-muted-foreground mb-4 text-sm">
        Image {imagePosition} — 4+6 @ desktop (10-col band), 6+6 @ tablet/mobile
      </p>
      <ImageTextBlock
        body={SAMPLE_BODY}
        image={DEV_IMAGE}
        imagePosition={imagePosition}
        photoCredit="Photographer Name"
      />
    </div>
  )
}

export default function ImageTextBlockDevPage() {
  return (
    <SectionBand className="overflow-x-clip bg-white py-12">
      <SiteShell>
        <Grid12 data-slot="article-body-grid">
          <DevImageTextRow imagePosition="left" />
          <DevImageTextRow imagePosition="right" />
        </Grid12>
      </SiteShell>
    </SectionBand>
  )
}

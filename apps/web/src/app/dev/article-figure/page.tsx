import type {PortableTextBlock} from '@portabletext/react'
import type {Metadata} from 'next'

import {ArticleFigure} from '@/components/content/article-figure'
import {Grid12, SectionBand, SiteShell} from '@/components/layout'
import {ARTICLE_COL_10_CENTERED_CLASS} from '@/lib/article-body-grid'
import {cn} from '@/lib/utils'

import windmillsImage from './windmills.png'

export const metadata: Metadata = {
  title: 'Article figure dev',
  robots: {index: false, follow: false},
}

const DEV_FIGURE_IMAGE = {
  src: windmillsImage.src,
  alt: 'Wind turbines on a green hillside under a pale sky',
  width: windmillsImage.width,
  height: windmillsImage.height,
} as const

const SAMPLE_CAPTION: PortableTextBlock[] = [
  {
    _type: 'block',
    _key: 'cap1',
    style: 'normal',
    children: [
      {
        _type: 'span',
        _key: 'cap1a',
        text: 'Caption with ',
        marks: [],
      },
      {
        _type: 'span',
        _key: 'cap1b',
        text: 'bold',
        marks: ['strong'],
      },
      {
        _type: 'span',
        _key: 'cap1c',
        text: ' and a ',
        marks: [],
      },
      {
        _type: 'span',
        _key: 'cap1d',
        text: 'link',
        marks: ['link1'],
      },
      {
        _type: 'span',
        _key: 'cap1e',
        text: ' for layout QA.',
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
]

function DevFigureBlock({
  title,
  creditAlign,
  withCaption,
}: {
  title: string
  creditAlign: 'left' | 'center'
  withCaption?: boolean
}) {
  return (
    <div data-slot="article-body-block" className={cn(ARTICLE_COL_10_CENTERED_CLASS, 'min-w-0')}>
      <p className="text-muted-foreground mb-4 text-sm">{title}</p>
      <ArticleFigure
        creditAlign={creditAlign}
        image={DEV_FIGURE_IMAGE}
        imageSize="single10"
        photoCredit="Person's Name"
        caption={withCaption ? SAMPLE_CAPTION : undefined}
      />
    </div>
  )
}

export default function ArticleFigureDevPage() {
  return (
    <SectionBand className="overflow-x-clip bg-white py-12">
      <SiteShell>
        <Grid12 data-slot="article-body-grid">
          <DevFigureBlock creditAlign="center" title="Single figure — centered credit" />
          <DevFigureBlock
            creditAlign="left"
            title="Single figure — left credit + caption (24px Figtree)"
            withCaption
          />
          <DevFigureBlock creditAlign="left" title="Credit only, no caption" />
        </Grid12>
      </SiteShell>
    </SectionBand>
  )
}

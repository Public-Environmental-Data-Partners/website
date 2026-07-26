import {
  defaultComponents,
  mergeComponents,
  PortableText,
  type PortableTextBlock,
  type PortableTextComponents,
} from '@portabletext/react'
import Image from 'next/image'

import {contentLinkMark} from '@/components/content/portable-text-link'
import type {DonateInfoSectionProps} from '@/lib/mappers/donate-sections'

const bodyComponents: Partial<PortableTextComponents> = {
  block: {
    normal: ({children}: {children?: React.ReactNode}) => <p>{children}</p>,
  },
  marks: {
    strong: ({children}: {children?: React.ReactNode}) => (
      <strong className="font-bold">{children}</strong>
    ),
    link: contentLinkMark('underline underline-offset-2'),
  },
}

const richTextComponents = mergeComponents(defaultComponents, bodyComponents)

function DonateInfoRule() {
  return <hr data-slot="donate-info-rule" aria-hidden="true" />
}

/**
 * Light-green donate info box: section heading, lead body, prompt, icon rows.
 */
export function DonateInfoBox({sectionHeading, body, prompt, rows}: DonateInfoSectionProps) {
  const headingId = 'donate-info-heading'

  return (
    <aside data-slot="donate-info-box" aria-labelledby={headingId}>
      <h2 data-slot="donate-info-heading" id={headingId}>
        {sectionHeading}
      </h2>
      <div data-slot="donate-info-body">
        <PortableText components={richTextComponents} value={body as PortableTextBlock[]} />
      </div>
      <p data-slot="donate-info-prompt">{prompt}</p>
      <DonateInfoRule />
      <div data-slot="donate-info-rows">
        {rows.map((row, index) => (
          <div key={`${index}-${row.label}`}>
            <div data-slot="donate-info-row">
              <span data-slot="donate-info-icon" aria-hidden="true">
                <Image
                  src={row.iconSrc}
                  alt=""
                  width={row.iconWidth ?? 72}
                  height={row.iconHeight ?? 72}
                  unoptimized
                />
              </span>
              <p data-slot="donate-info-label">{row.label}</p>
            </div>
            {index < rows.length - 1 ? <DonateInfoRule /> : null}
          </div>
        ))}
      </div>
    </aside>
  )
}

import {PortableText, type PortableTextBlock} from '@portabletext/react'
import type {LucideIcon} from 'lucide-react'
import type {ReactNode} from 'react'

import {listBlockPortableTextComponents} from '@/components/content/list-block-rich-text'
import {resolveLucideIcon} from '@/lib/lucide-icon'
import {cn} from '@/lib/utils'

export type ListBlockBackground = 'lightGreen' | 'lightBlue'

export type ListBlockVariant =
  | 'unstyled'
  | 'dividedParagraph'
  | 'dividedIcon'
  | 'dividedOrdered'
  | 'dividedBulleted'

export type ListBlockRow = {
  icon?: string | null
  content?: PortableTextBlock[] | null
}

export type ListBlockBulletedSection = {
  sectionTitle?: string | null
  bullets?: string[] | null
}

export type ListBlockProps = {
  variant: ListBlockVariant
  background: ListBlockBackground
  title?: string | null
  lines?: string[] | null
  rows?: ListBlockRow[] | null
  sections?: ListBlockBulletedSection[] | null
}

function ListBlockRule() {
  return <hr data-slot="list-block-rule" aria-hidden="true" />
}

function ListBlockBody({value}: {value: PortableTextBlock[]}) {
  if (!value.length) {
    return null
  }

  return (
    <div data-slot="list-block-body">
      <PortableText components={listBlockPortableTextComponents} value={value} />
    </div>
  )
}

function normalizeLines(lines: string[] | null | undefined): string[] {
  if (!Array.isArray(lines)) {
    return []
  }
  return lines.map((line) => (typeof line === 'string' ? line.trim() : '')).filter(Boolean)
}

function normalizeRows(rows: ListBlockRow[] | null | undefined): ListBlockRow[] {
  if (!Array.isArray(rows)) {
    return []
  }
  return rows.filter((row) => Array.isArray(row.content) && row.content.length > 0)
}

function normalizeSections(
  sections: ListBlockBulletedSection[] | null | undefined,
): Array<{sectionTitle?: string; bullets: string[]}> {
  if (!Array.isArray(sections)) {
    return []
  }

  return sections.flatMap((section) => {
    const bullets = Array.isArray(section.bullets)
      ? section.bullets
          .map((bullet) => (typeof bullet === 'string' ? bullet.trim() : ''))
          .filter(Boolean)
      : []
    if (bullets.length === 0) {
      return []
    }
    const sectionTitle = typeof section.sectionTitle === 'string' ? section.sectionTitle.trim() : ''
    return [
      {
        ...(sectionTitle.length > 0 ? {sectionTitle} : {}),
        bullets,
      },
    ]
  })
}

function DividedParagraphRows({rows}: {rows: ListBlockRow[]}) {
  return (
    <div data-slot="list-block-divided-rows">
      {rows.map((row, index) => {
        const content = Array.isArray(row.content) ? row.content : []
        return (
          <div key={`row-${index}`}>
            <div data-slot="list-block-row">
              <ListBlockBody value={content} />
            </div>
            {index < rows.length - 1 ? <ListBlockRule /> : null}
          </div>
        )
      })}
    </div>
  )
}

function DividedIconRows({rows}: {rows: ListBlockRow[]}) {
  const visibleRows = rows
    .map((row) => {
      const iconName = typeof row.icon === 'string' ? row.icon.trim() : ''
      const Icon = iconName ? resolveLucideIcon(iconName) : null
      const content = Array.isArray(row.content) ? row.content : []
      if (content.length === 0) {
        return null
      }
      return {Icon, content}
    })
    .filter((row): row is {Icon: LucideIcon | null; content: PortableTextBlock[]} => row !== null)

  if (visibleRows.length === 0) {
    return null
  }

  return (
    <div data-slot="list-block-divided-rows">
      {visibleRows.map(({Icon, content}, index) => (
        <div key={`icon-row-${index}`}>
          <div data-slot="list-block-row">
            {Icon ? (
              <span data-slot="list-block-icon" aria-hidden="true">
                <Icon strokeWidth={2} className="size-full" />
              </span>
            ) : null}
            <ListBlockBody value={content} />
          </div>
          {index < visibleRows.length - 1 ? <ListBlockRule /> : null}
        </div>
      ))}
    </div>
  )
}

function DividedOrderedRows({rows}: {rows: ListBlockRow[]}) {
  const visibleRows = rows.filter((row) => Array.isArray(row.content) && row.content.length > 0)
  if (visibleRows.length === 0) {
    return null
  }

  return (
    <ol data-slot="list-block-ordered-rows">
      {visibleRows.map((row, index) => {
        const content = Array.isArray(row.content) ? row.content : []
        return (
          <li key={`ordered-row-${index}`} data-slot="list-block-row">
            <span data-slot="list-block-number" aria-hidden="true">
              {index + 1}
            </span>
            <ListBlockBody value={content} />
          </li>
        )
      })}
    </ol>
  )
}

function UnstyledLines({lines}: {lines: string[]}) {
  return (
    <ul data-slot="list-block-unstyled-lines">
      {lines.map((line, index) => (
        <li key={`${index}-${line}`}>{line}</li>
      ))}
    </ul>
  )
}

function DividedBulletedSections({
  sections,
}: {
  sections: Array<{sectionTitle?: string; bullets: string[]}>
}) {
  return (
    <div data-slot="list-block-bulleted-sections">
      {sections.map((section, index) => (
        <div key={section.sectionTitle ?? `section-${index}`}>
          <section data-slot="list-block-bulleted-section">
            {section.sectionTitle ? (
              <h4 data-slot="list-block-section-title">{section.sectionTitle}</h4>
            ) : null}
            <ul data-slot="list-block-bullets">
              {section.bullets.map((bullet, bulletIndex) => (
                <li key={`${bulletIndex}-${bullet}`}>{bullet}</li>
              ))}
            </ul>
          </section>
          {index < sections.length - 1 ? <ListBlockRule /> : null}
        </div>
      ))}
    </div>
  )
}

export function ListBlock({variant, background, title, lines, rows, sections}: ListBlockProps) {
  const trimmedTitle = typeof title === 'string' ? title.trim() : ''
  const normalizedLines = normalizeLines(lines)
  const normalizedRows = normalizeRows(rows)
  const normalizedSections = normalizeSections(sections)

  const hasTitle = trimmedTitle.length > 0
  let content: ReactNode = null

  switch (variant) {
    case 'unstyled':
      content = normalizedLines.length > 0 ? <UnstyledLines lines={normalizedLines} /> : null
      break
    case 'dividedParagraph':
      content = normalizedRows.length > 0 ? <DividedParagraphRows rows={normalizedRows} /> : null
      break
    case 'dividedIcon':
      content = <DividedIconRows rows={normalizedRows} />
      break
    case 'dividedOrdered':
      content = <DividedOrderedRows rows={normalizedRows} />
      break
    case 'dividedBulleted':
      content =
        normalizedSections.length > 0 ? (
          <DividedBulletedSections sections={normalizedSections} />
        ) : null
      break
    default:
      content = null
  }

  if (!hasTitle && !content) {
    return null
  }

  return (
    <aside
      data-slot="list-block"
      data-variant={variant}
      data-background={background}
      className={cn(
        background === 'lightBlue' ? 'bg-light-blue' : 'bg-light-green',
        background === 'lightBlue' ? 'text-dark-blue' : 'text-dark-green',
      )}
    >
      {hasTitle ? <h3 data-slot="list-block-title">{trimmedTitle}</h3> : null}
      {hasTitle ? <ListBlockRule /> : null}
      {content}
    </aside>
  )
}

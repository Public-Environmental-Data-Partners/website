import assert from 'node:assert/strict'
import {describe, it} from 'node:test'

import {
  firstNonEmpty,
  pickContactSectionHeading,
  pickNewsletterPrompt,
  pickSectionHeadingFromHeading,
  pickSectionHeadingFromKicker,
} from './content-field-compat.ts'

describe('firstNonEmpty', () => {
  it('returns the first trimmed non-empty value', () => {
    assert.equal(firstNonEmpty('  ', null, ' Alpha ', 'Beta'), 'Alpha')
  })

  it('returns undefined when every value is empty', () => {
    assert.equal(firstNonEmpty(undefined, null, '  '), undefined)
  })
})

describe('pickSectionHeadingFromKicker', () => {
  it('prefers sectionHeading over kicker', () => {
    assert.equal(
      pickSectionHeadingFromKicker({sectionHeading: 'NEW', kicker: 'OLD'}),
      'NEW',
    )
  })

  it('falls back to kicker', () => {
    assert.equal(pickSectionHeadingFromKicker({kicker: 'OLD'}), 'OLD')
  })
})

describe('pickSectionHeadingFromHeading', () => {
  it('prefers sectionHeading over heading', () => {
    assert.equal(
      pickSectionHeadingFromHeading({sectionHeading: 'NEW', heading: 'OLD'}),
      'NEW',
    )
  })

  it('falls back to heading', () => {
    assert.equal(pickSectionHeadingFromHeading({heading: 'OLD'}), 'OLD')
  })
})

describe('pickContactSectionHeading', () => {
  it('prefers sectionHeading, then kicker, then heading', () => {
    assert.equal(
      pickContactSectionHeading({
        sectionHeading: 'A',
        kicker: 'B',
        heading: 'C',
      }),
      'A',
    )
    assert.equal(pickContactSectionHeading({kicker: 'B', heading: 'C'}), 'B')
    assert.equal(pickContactSectionHeading({heading: 'C'}), 'C')
  })
})

describe('pickNewsletterPrompt', () => {
  it('prefers prompt over heading', () => {
    assert.equal(pickNewsletterPrompt({prompt: 'NEW', heading: 'OLD'}), 'NEW')
  })

  it('falls back to heading', () => {
    assert.equal(pickNewsletterPrompt({heading: 'OLD'}), 'OLD')
  })
})

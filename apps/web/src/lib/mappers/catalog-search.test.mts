import assert from 'node:assert/strict'
import {test} from 'node:test'

import {catalogMatchesQuery, catalogSearchTokens} from './catalog-search.ts'

const plantMap = '2023 plant hardiness zone map united states department of agriculture'

test('empty query matches every card', () => {
  assert.equal(catalogMatchesQuery(plantMap, ''), true)
  assert.equal(catalogMatchesQuery(plantMap, '   '), true)
  assert.equal(catalogMatchesQuery(plantMap, '""'), true)
  assert.deepEqual(catalogSearchTokens(''), [])
})

test('unquoted tokens still AND together', () => {
  assert.equal(catalogMatchesQuery(plantMap, 'plant'), true)
  assert.equal(catalogMatchesQuery(plantMap, 'plant hardiness'), true)
  assert.equal(catalogMatchesQuery(plantMap, 'plant missing'), false)
})

test('quoted term matches without the quote characters', () => {
  assert.equal(catalogMatchesQuery(plantMap, '"plant"'), true)
  assert.equal(catalogMatchesQuery(plantMap, "'plant'"), true)
  assert.deepEqual(catalogSearchTokens('"plant"'), ['plant'])
  assert.deepEqual(catalogSearchTokens("'plant'"), ['plant'])
})

test('curly quotes are treated as quote syntax', () => {
  assert.equal(catalogMatchesQuery(plantMap, '“plant”'), true)
  assert.equal(catalogMatchesQuery(plantMap, '‘plant’'), true)
  assert.deepEqual(catalogSearchTokens('“plant hardiness”'), ['plant hardiness'])
})

test('quoted phrase matches consecutive words only', () => {
  assert.equal(catalogMatchesQuery(plantMap, '"plant hardiness"'), true)
  assert.equal(catalogMatchesQuery(plantMap, '"hardiness plant"'), false)
  assert.equal(catalogMatchesQuery('plant map hardiness notes', '"plant hardiness"'), false)
  assert.equal(catalogMatchesQuery('plant map hardiness notes', 'plant hardiness'), true)
})

test('quoted and unquoted tokens can mix', () => {
  assert.equal(catalogMatchesQuery(plantMap, 'agriculture "hardiness zone"'), true)
  assert.equal(catalogMatchesQuery(plantMap, 'missing "hardiness zone"'), false)
})

test('inner whitespace in quotes collapses', () => {
  assert.deepEqual(catalogSearchTokens('"  plant   hardiness  "'), ['plant hardiness'])
  assert.equal(catalogMatchesQuery(plantMap, '"  plant   hardiness  "'), true)
})

test('unquoted apostrophes stay part of the token', () => {
  assert.deepEqual(catalogSearchTokens("women's health"), ["women's", 'health'])
  assert.equal(catalogMatchesQuery("women's health survey", "women's"), true)
})

test('tokens match whole words, not substrings', () => {
  const tedsNotes =
    'service type including planned use of otps and an explanation of the plant hardiness map'
  assert.equal(catalogMatchesQuery(tedsNotes, 'plan'), false)
  assert.equal(catalogMatchesQuery(tedsNotes, '"plan"'), false)
  assert.equal(catalogMatchesQuery(tedsNotes, 'planned'), true)
  assert.equal(catalogMatchesQuery(tedsNotes, 'plant'), true)
  assert.equal(catalogMatchesQuery(plantMap, 'hardin'), false)
  assert.equal(catalogMatchesQuery(plantMap, 'plant'), true)
})

test('regex characters in a token are literal', () => {
  const doi = '10.7910/dvn/jemcqj treatment episode data set'
  assert.equal(catalogMatchesQuery(doi, '10.7910'), true)
  assert.equal(catalogMatchesQuery(doi, 'jemcqj'), true)
})

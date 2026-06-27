/**
 * @file Type Tests - TokenTypeMap
 * @module docmark-util-types/tests/unit-d/TokenTypeMap
 */

import type * as micromark from 'micromark-util-types'
import type TestSubject from '../token-type-map.mts'

describe('unit-d:TokenTypeMap', () => {
  it('should extend micromark.TokenTypeMap', () => {
    expectTypeOf<TestSubject>().toExtend<micromark.TokenTypeMap>()
  })

  it('should match [blockTag: "blockTag"]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('blockTag')
      .toEqualTypeOf<'blockTag'>()
  })

  it('should match [chunkComment: "chunkComment"]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('chunkComment')
      .toEqualTypeOf<'chunkComment'>()
  })

  it('should match [chunkMarkdown: "chunkMarkdown"]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('chunkMarkdown')
      .toEqualTypeOf<'chunkMarkdown'>()
  })

  it('should match [comment: "comment"]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('comment')
      .toEqualTypeOf<'comment'>()
  })

  it('should match [commentCloser: "commentCloser"]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('commentCloser')
      .toEqualTypeOf<'commentCloser'>()
  })

  it('should match [commentLineMarker: "commentLineMarker"]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('commentLineMarker')
      .toEqualTypeOf<'commentLineMarker'>()
  })

  it('should match [commentLinePadding: "commentLinePadding"]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('commentLinePadding')
      .toEqualTypeOf<'commentLinePadding'>()
  })

  it('should match [commentLinePrefix: "commentLinePrefix"]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('commentLinePrefix')
      .toEqualTypeOf<'commentLinePrefix'>()
  })

  it('should match [commentOpener: "commentOpener"]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('commentOpener')
      .toEqualTypeOf<'commentOpener'>()
  })

  it('should match [eoc: "eoc"]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('eoc').toEqualTypeOf<'eoc'>()
  })

  it('should match [inlineTag: "inlineTag"]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('inlineTag')
      .toEqualTypeOf<'inlineTag'>()
  })

  it('should match [inlineTagText: "inlineTagText"]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('inlineTagText')
      .toEqualTypeOf<'inlineTagText'>()
  })

  it('should match [null: never]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('null').toEqualTypeOf<never>()
  })

  it('should match [summary: "summary"]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('summary')
      .toEqualTypeOf<'summary'>()
  })

  it('should match [tagName: "tagName"]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('tagName')
      .toEqualTypeOf<'tagName'>()
  })

  it('should match [tagNameIdentifier: "tagNameIdentifier"]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('tagNameIdentifier')
      .toEqualTypeOf<'tagNameIdentifier'>()
  })

  it('should match [tagNameMarker: "tagNameMarker"]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('tagNameMarker')
      .toEqualTypeOf<'tagNameMarker'>()
  })
})

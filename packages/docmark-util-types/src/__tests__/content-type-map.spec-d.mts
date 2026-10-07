/**
 * @file Type Tests - ContentTypeMap
 * @module docmark-util-types/tests/unit-d/ContentTypeMap
 */

import { describe, expectTypeOf, it } from 'vitest'
import type TestSubject from '../content-type-map.mts'

describe('unit-d:ContentTypeMap', () => {
  it('should match [comment: "comment"]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('comment')
      .toEqualTypeOf<'comment'>()
  })

  it('should match [comments: "comments"]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('comments')
      .toEqualTypeOf<'comments'>()
  })

  it('should match [content: "content"]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('content')
      .toEqualTypeOf<'content'>()
  })

  it('should match [document: "document"]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('document')
      .toEqualTypeOf<'document'>()
  })

  it('should match [flow: "flow"]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('flow').toEqualTypeOf<'flow'>()
  })

  it('should match [language: "language"]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('language')
      .toEqualTypeOf<'language'>()
  })

  it('should match [string: "string"]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('string')
      .toEqualTypeOf<'string'>()
  })

  it('should match [text: "text"]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('text').toEqualTypeOf<'text'>()
  })

  it('should match [type: "type"]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('type').toEqualTypeOf<'type'>()
  })
})

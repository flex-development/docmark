/**
 * @file Type Tests - ParseContext
 * @module docmark-util-types/tests/unit-d/ParseContext
 */

import type {
  Create,
  FullNormalizedExtension,
  Line
} from '@flex-development/docmark-util-types'
import type TestSubject from '../parse-context.mts'

describe('unit-d:ParseContext', () => {
  it('should match [comment: Create]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('comment')
      .toEqualTypeOf<Create>()
  })

  it('should match [constructs: FullNormalizedExtension]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('constructs')
      .toEqualTypeOf<FullNormalizedExtension>()
  })

  it('should match [content: Create]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('content')
      .toEqualTypeOf<Create>()
  })

  it('should match [defined: string[]]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('defined')
      .toEqualTypeOf<string[]>()
  })

  it('should match [document: Create]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('document')
      .toEqualTypeOf<Create>()
  })

  it('should match [flow: Create]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('flow').toEqualTypeOf<Create>()
  })

  it('should match [lazy: Record<Line, boolean>]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('lazy')
      .toEqualTypeOf<Record<Line, boolean>>()
  })

  it('should match [source: Create]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('source').toEqualTypeOf<Create>()
  })

  it('should match [string: Create]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('string').toEqualTypeOf<Create>()
  })

  it('should match [text: Create]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('text').toEqualTypeOf<Create>()
  })
})

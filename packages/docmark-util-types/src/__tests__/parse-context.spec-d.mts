/**
 * @file Type Tests - ParseContext
 * @module docmark-util-types/tests/unit-d/ParseContext
 */

import type {
  Create,
  FullNormalizedExtension,
  Lazy
} from '@flex-development/docmark-util-types'
import type { Nilable } from '@flex-development/tutils'
import { describe, expectTypeOf, it } from 'vitest'
import type TestSubject from '../parse-context.mts'

describe('unit-d:ParseContext', () => {
  it('should match [atBlankLine?: boolean | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('atBlankLine')
      .toEqualTypeOf<Nilable<boolean>>()
  })

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

  it('should match [freshComment?: boolean | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('freshComment')
      .toEqualTypeOf<Nilable<boolean>>()
  })

  it('should match [freshRegion?: boolean | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('freshRegion')
      .toEqualTypeOf<Nilable<boolean>>()
  })

  it('should match [lazy: Lazy]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('lazy').toEqualTypeOf<Lazy>()
  })

  it('should match [previousBlankLine?: boolean | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('previousBlankLine')
      .toEqualTypeOf<Nilable<boolean>>()
  })

  it('should match [skipSummary?: boolean | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('skipSummary')
      .toEqualTypeOf<boolean | undefined>()
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

  it('should match [type: Create]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('type').toEqualTypeOf<Create>()
  })
})

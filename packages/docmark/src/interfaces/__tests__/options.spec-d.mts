/**
 * @file Type Tests - Options
 * @module docmark/interfaces/tests/unit-d/Options
 */

import type {
  ContentType,
  ParseOptions,
  Point,
  PreprocessOptions
} from '@flex-development/docmark-util-types'
import type { Nilable, OptionalKeys } from '@flex-development/tutils'
import { describe, expectTypeOf, it } from 'vitest'
import type TestSubject from '../options.mts'

describe('unit-d:interfaces/Options', () => {
  it('should extend ParseOptions', () => {
    expectTypeOf<TestSubject>().toExtend<ParseOptions>()
  })

  it('should extend PreprocessOptions', () => {
    expectTypeOf<TestSubject>().toExtend<PreprocessOptions>()
  })

  it('should have all optional keys', () => {
    expectTypeOf<keyof TestSubject>().toEqualTypeOf<OptionalKeys<TestSubject>>()
  })

  it('should match [contentType?: ContentType | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('contentType')
      .toEqualTypeOf<Nilable<ContentType>>()
  })

  it('should match [from?: Point | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('from')
      .toEqualTypeOf<Nilable<Point>>()
  })
})

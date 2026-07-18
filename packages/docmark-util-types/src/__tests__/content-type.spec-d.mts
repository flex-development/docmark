/**
 * @file Type Tests - ContentType
 * @module docmark-util-types/tests/unit-d/ContentType
 */

import type * as micromark from 'micromark-util-types'
import { describe, expectTypeOf, it } from 'vitest'
import type TestSubject from '../content-type.mts'

describe('unit-d:ContentType', () => {
  it('should extract "comment"', () => {
    expectTypeOf<TestSubject>().extract<'comment'>().not.toBeNever()
  })

  it('should extract "source"', () => {
    expectTypeOf<TestSubject>().extract<'source'>().not.toBeNever()
  })

  it('should extract "type"', () => {
    expectTypeOf<TestSubject>().extract<'type'>().not.toBeNever()
  })

  it('should extract micromark.ContentType', () => {
    expectTypeOf<TestSubject>().extract<micromark.ContentType>().not.toBeNever()
  })
})

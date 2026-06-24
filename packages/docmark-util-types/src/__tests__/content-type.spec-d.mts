/**
 * @file Type Tests - ContentType
 * @module docmark-util-types/tests/unit-d/ContentType
 */

import type * as micromark from 'micromark-util-types'
import type TestSubject from '../content-type.mts'

describe('unit-d:types/ContentType', () => {
  it('should extract "comment"', () => {
    expectTypeOf<TestSubject>().extract<'comment'>().not.toBeNever()
  })

  it('should extract "source"', () => {
    expectTypeOf<TestSubject>().extract<'source'>().not.toBeNever()
  })

  it('should extract micromark.ContentType', () => {
    expectTypeOf<TestSubject>().extract<micromark.ContentType>().not.toBeNever()
  })
})

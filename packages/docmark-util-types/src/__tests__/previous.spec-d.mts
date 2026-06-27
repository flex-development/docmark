/**
 * @file Type Tests - Previous
 * @module docmark-util-types/tests/unit-d/Previous
 */

import type {
  Code,
  TokenizeContext
} from '@flex-development/docmark-util-types'
import type TestSubject from '../previous.mts'

describe('unit-d:Previous', () => {
  it('should match [this: TokenizeContext]', () => {
    expectTypeOf<TestSubject>().thisParameter.toEqualTypeOf<TokenizeContext>()
  })

  describe('parameters', () => {
    it('should be callable with [Code]', () => {
      expectTypeOf<TestSubject>().parameters.toEqualTypeOf<[Code]>()
    })
  })

  describe('returns', () => {
    it('should return boolean', () => {
      expectTypeOf<TestSubject>().returns.toEqualTypeOf<boolean>()
    })
  })
})

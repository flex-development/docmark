/**
 * @file Type Tests - Create
 * @module docmark-util-types/tests/unit-d/Create
 */

import type {
  Point,
  TokenizeContext
} from '@flex-development/docmark-util-types'
import type TestSubject from '../create.mts'

describe('unit-d:types/Create', () => {
  it('should match [this: void]', () => {
    expectTypeOf<TestSubject>().thisParameter.toEqualTypeOf<void>()
  })

  describe('parameters', () => {
    it('should be callable with [(Point | undefined)?]', () => {
      // Arrange
      type Expect = [(Point | undefined)?]

      // Expect
      expectTypeOf<TestSubject>().parameters.toEqualTypeOf<Expect>()
    })
  })

  describe('returns', () => {
    it('should return TokenizeContext', () => {
      expectTypeOf<TestSubject>().returns.toEqualTypeOf<TokenizeContext>()
    })
  })
})

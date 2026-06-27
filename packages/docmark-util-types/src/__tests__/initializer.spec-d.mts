/**
 * @file Type Tests - Initializer
 * @module docmark-util-types/tests/unit-d/Initializer
 */

import type {
  Effects,
  State,
  TokenizeContext
} from '@flex-development/docmark-util-types'
import type TestSubject from '../initializer.mts'

describe('unit-d:Initializer', () => {
  it('should match [this: TokenizeContext]', () => {
    expectTypeOf<TestSubject>().thisParameter.toEqualTypeOf<TokenizeContext>()
  })

  describe('parameters', () => {
    it('should be callable with [Effects]', () => {
      expectTypeOf<TestSubject>().parameters.toEqualTypeOf<[Effects]>()
    })
  })

  describe('returns', () => {
    it('should return State', () => {
      expectTypeOf<TestSubject>().returns.toEqualTypeOf<State>()
    })
  })
})

/**
 * @file Type Tests - Exiter
 * @module docmark-util-types/tests/unit-d/Exiter
 */

import type {
  Effects,
  TokenizeContext
} from '@flex-development/docmark-util-types'
import type TestSubject from '../exiter.mts'

describe('unit-d:types/Exiter', () => {
  it('should match [this: TokenizeContext]', () => {
    expectTypeOf<TestSubject>().thisParameter.toEqualTypeOf<TokenizeContext>()
  })

  describe('parameters', () => {
    it('should be callable with [Effects]', () => {
      expectTypeOf<TestSubject>().parameters.toEqualTypeOf<[Effects]>()
    })
  })

  describe('returns', () => {
    it('should return undefined', () => {
      expectTypeOf<TestSubject>().returns.toEqualTypeOf<undefined>()
    })
  })
})

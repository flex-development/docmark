/**
 * @file Type Tests - Tokenizer
 * @module docmark-util-types/tests/unit-d/Tokenizer
 */

import type {
  Effects,
  State,
  TokenizeContext
} from '@flex-development/docmark-util-types'
import type TestSubject from '../tokenizer.mts'

describe('unit-d:Tokenizer', () => {
  it('should match [this: TokenizeContext]', () => {
    expectTypeOf<TestSubject>().thisParameter.toEqualTypeOf<TokenizeContext>()
  })

  describe('parameters', () => {
    it('should be callable with [Effects, State, State]', () => {
      expectTypeOf<TestSubject>()
        .parameters
        .toEqualTypeOf<[Effects, State, State]>()
    })
  })

  describe('returns', () => {
    it('should return State', () => {
      expectTypeOf<TestSubject>().returns.toEqualTypeOf<State>()
    })
  })
})

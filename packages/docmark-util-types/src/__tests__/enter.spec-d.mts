/**
 * @file Type Tests - Enter
 * @module docmark-util-types/tests/unit-d/Enter
 */

import type {
  Token,
  TokenFields,
  TokenType
} from '@flex-development/docmark-util-types'
import type TestSubject from '../enter.mts'

describe('unit-d:types/Enter', () => {
  it('should match [this: void]', () => {
    expectTypeOf<TestSubject>().thisParameter.toEqualTypeOf<void>()
  })

  describe('parameters', () => {
    it('should be callable with [TokenType, (TokenFields | undefined)?]', () => {
      expectTypeOf<TestSubject>()
        .parameters
        .toEqualTypeOf<[TokenType, (TokenFields | undefined)?]>()
    })
  })

  describe('returns', () => {
    it('should return Token', () => {
      expectTypeOf<TestSubject>().returns.toEqualTypeOf<Token>()
    })
  })
})

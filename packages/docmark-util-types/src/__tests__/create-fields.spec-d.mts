/**
 * @file Type Tests - CreateFields
 * @module docmark-util-types/tests/unit-d/CreateFields
 */

import type {
  TokenFields,
  TokenizeContext
} from '@flex-development/docmark-util-types'
import { describe, expectTypeOf, it } from 'vitest'
import type TestSubject from '../create-fields.mts'

describe('unit-d:CreateFields', () => {
  it('should match [this: TokenizeContext]', () => {
    expectTypeOf<TestSubject>().thisParameter.toEqualTypeOf<TokenizeContext>()
  })

  describe('parameters', () => {
    it('should be callable with []', () => {
      expectTypeOf<TestSubject>().parameters.toEqualTypeOf<[]>()
    })
  })

  describe('returns', () => {
    it('should return TokenFields', () => {
      expectTypeOf<TestSubject>().returns.toEqualTypeOf<TokenFields>()
    })
  })
})

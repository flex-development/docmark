/**
 * @file Type Tests - CreateMarkersPack
 * @module docmark-util-types/tests/unit-d/CreateMarkersPack
 */

import type {
  MarkersPack,
  TokenizeContext
} from '@flex-development/docmark-util-types'
import { describe, expectTypeOf, it } from 'vitest'
import type TestSubject from '../create-markers-pack.mts'

describe('unit-d:CreateMarkersPack', () => {
  it('should match [this: TokenizeContext]', () => {
    expectTypeOf<TestSubject>().thisParameter.toEqualTypeOf<TokenizeContext>()
  })

  describe('parameters', () => {
    it('should be callable with []', () => {
      expectTypeOf<TestSubject>().parameters.toEqualTypeOf<[]>()
    })
  })

  describe('returns', () => {
    it('should return MarkersPack', () => {
      expectTypeOf<TestSubject>().returns.toEqualTypeOf<MarkersPack>()
    })
  })
})

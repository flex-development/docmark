/**
 * @file Type Tests - CreateMarkers
 * @module docmark-factory-block/types/tests/unit-d/CreateMarkers
 */

import type { Markers } from '@flex-development/docmark-factory-block'
import type { TokenizeContext } from '@flex-development/docmark-util-types'
import { describe, expectTypeOf, it } from 'vitest'
import type TestSubject from '../create-markers.mts'

describe('unit-d:CreateMarkers', () => {
  it('should match [this: TokenizeContext]', () => {
    expectTypeOf<TestSubject>().thisParameter.toEqualTypeOf<TokenizeContext>()
  })

  describe('parameters', () => {
    it('should be callable with []', () => {
      expectTypeOf<TestSubject>().parameters.toEqualTypeOf<[]>()
    })
  })

  describe('returns', () => {
    it('should return Markers', () => {
      expectTypeOf<TestSubject>().returns.toEqualTypeOf<Markers>()
    })
  })
})

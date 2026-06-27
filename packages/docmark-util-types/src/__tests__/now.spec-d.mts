/**
 * @file Type Tests - Now
 * @module docmark-util-types/tests/unit-d/Now
 */

import type { Place } from '@flex-development/docmark-util-types'
import type { EmptyArray } from '@flex-development/tutils'
import type TestSubject from '../now.mts'

describe('unit-d:Now', () => {
  it('should match [this: void]', () => {
    expectTypeOf<TestSubject>().thisParameter.toEqualTypeOf<void>()
  })

  describe('parameters', () => {
    it('should be callable with []', () => {
      expectTypeOf<TestSubject>().parameters.toEqualTypeOf<EmptyArray>()
    })
  })

  describe('returns', () => {
    it('should return Place', () => {
      expectTypeOf<TestSubject>().returns.toEqualTypeOf<Place>()
    })
  })
})

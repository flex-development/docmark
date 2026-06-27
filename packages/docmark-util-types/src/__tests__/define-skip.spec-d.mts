/**
 * @file Type Tests - DefineSkip
 * @module docmark-util-types/tests/unit-d/DefineSkip
 */

import type { Place } from '@flex-development/docmark-util-types'
import type TestSubject from '../define-skip.mts'

describe('unit-d:DefineSkip', () => {
  it('should match [this: void]', () => {
    expectTypeOf<TestSubject>().thisParameter.toEqualTypeOf<void>()
  })

  describe('parameters', () => {
    it('should be callable with [Place]', () => {
      expectTypeOf<TestSubject>().parameters.toEqualTypeOf<[Place]>()
    })
  })

  describe('returns', () => {
    it('should return undefined', () => {
      expectTypeOf<TestSubject>().returns.toEqualTypeOf<undefined>()
    })
  })
})

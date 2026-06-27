/**
 * @file Type Tests - State
 * @module docmark-util-types/tests/unit-d/State
 */

import type { Code } from '@flex-development/docmark-util-types'
import type { Optional } from '@flex-development/tutils'
import type TestSubject from '../state.mts'

describe('unit-d:State', () => {
  it('should match [this: void]', () => {
    expectTypeOf<TestSubject>().thisParameter.toEqualTypeOf<void>()
  })

  describe('parameters', () => {
    it('should be callable with [Code]', () => {
      expectTypeOf<TestSubject>().parameters.toEqualTypeOf<[Code]>()
    })
  })

  describe('returns', () => {
    it('should return State | undefined', () => {
      expectTypeOf<TestSubject>().returns.toEqualTypeOf<Optional<TestSubject>>()
    })
  })
})

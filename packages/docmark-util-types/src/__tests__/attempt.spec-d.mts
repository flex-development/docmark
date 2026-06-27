/**
 * @file Type Tests - Attempt
 * @module docmark-util-types/tests/unit-d/Attempt
 */

import type {
  Construct,
  ConstructRecord,
  State
} from '@flex-development/docmark-util-types'
import type TestSubject from '../attempt.mts'

describe('unit-d:Attempt', () => {
  it('should match [this: void]', () => {
    expectTypeOf<TestSubject>().thisParameter.toEqualTypeOf<void>()
  })

  describe('parameters', () => {
    it('should be callable with [Construct | Construct[] | ConstructRecord, State, (State | undefined)?]', () => {
      // Arrange
      type Expect = [
        Construct | Construct[] | ConstructRecord,
        State,
        (State | undefined)?
      ]

      // Expect
      expectTypeOf<TestSubject>().parameters.toEqualTypeOf<Expect>()
    })
  })

  describe('returns', () => {
    it('should return State', () => {
      expectTypeOf<TestSubject>().returns.toEqualTypeOf<State>()
    })
  })
})

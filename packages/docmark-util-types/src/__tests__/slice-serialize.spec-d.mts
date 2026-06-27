/**
 * @file Type Tests - SliceSerialize
 * @module docmark-util-types/tests/unit-d/SliceSerialize
 */

import type {
  Position,
  SerializeOptions
} from '@flex-development/docmark-util-types'
import type TestSubject from '../slice-serialize.mts'

describe('unit-d:SliceSerialize', () => {
  it('should match [this: void]', () => {
    expectTypeOf<TestSubject>().thisParameter.toEqualTypeOf<void>()
  })

  describe('parameters', () => {
    it('should be callable with [Position, (SerializeOptions | boolean | null | undefined)?]', () => {
      // Arrange
      type Expect = [Position, (SerializeOptions | boolean | null | undefined)?]

      // Expect
      expectTypeOf<TestSubject>().parameters.toEqualTypeOf<Expect>()
    })
  })

  describe('returns', () => {
    it('should return string', () => {
      expectTypeOf<TestSubject>().returns.toEqualTypeOf<string>()
    })
  })
})

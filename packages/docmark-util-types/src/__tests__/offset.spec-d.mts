/**
 * @file Type Tests - Offset
 * @module docmark-util-types/tests/unit-d/Offset
 */

import type TestSubject from '../offset.mts'

describe('unit-d:Offset', () => {
  it('should equal number', () => {
    expectTypeOf<TestSubject>().toEqualTypeOf<number>()
  })
})

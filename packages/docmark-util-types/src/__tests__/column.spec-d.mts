/**
 * @file Type Tests - Column
 * @module docmark-util-types/tests/unit-d/Column
 */

import type TestSubject from '../column.mts'

describe('unit-d:Column', () => {
  it('should equal number', () => {
    expectTypeOf<TestSubject>().toEqualTypeOf<number>()
  })
})

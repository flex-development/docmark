/**
 * @file Type Tests - Line
 * @module docmark-util-types/tests/unit-d/Line
 */

import type TestSubject from '../line.mts'

describe('unit-d:Line', () => {
  it('should equal number', () => {
    expectTypeOf<TestSubject>().toEqualTypeOf<number>()
  })
})

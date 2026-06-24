/**
 * @file Type Tests - ConstructPosition
 * @module docmark-util-types/tests/unit-d/ConstructPosition
 */

import type TestSubject from '../construct-position.mts'

describe('unit-d:types/ConstructPosition', () => {
  it('should extract "after"', () => {
    expectTypeOf<TestSubject>().extract<'after'>().not.toBeNever()
  })

  it('should extract "before"', () => {
    expectTypeOf<TestSubject>().extract<'before'>().not.toBeNever()
  })
})

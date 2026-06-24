/**
 * @file Type Tests - Disable
 * @module docmark-util-types/tests/unit-d/Disable
 */

import type TestSubject from '../disable.mts'

describe('unit-d:types/Disable', () => {
  it('should match [null?: string[] | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('null')
      .toEqualTypeOf<string[] | undefined>()
  })
})

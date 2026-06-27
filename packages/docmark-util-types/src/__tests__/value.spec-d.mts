/**
 * @file Type Tests - Value
 * @module docmark-util-types/tests/unit-d/Value
 */

import type TestSubject from '../value.mts'

describe('unit-d:Value', () => {
  it('should extract Uint8Array', () => {
    expectTypeOf<TestSubject>().extract<Uint8Array>().not.toBeNever()
  })

  it('should extract string', () => {
    expectTypeOf<TestSubject>().extract<string>().not.toBeNever()
  })
})

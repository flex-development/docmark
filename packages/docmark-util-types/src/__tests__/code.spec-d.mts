/**
 * @file Type Tests - Code
 * @module docmark-util-types/tests/unit-d/Code
 */

import { describe, expectTypeOf, it } from 'vitest'
import type TestSubject from '../code.mts'

describe('unit-d:Code', () => {
  it('should extract null', () => {
    expectTypeOf<TestSubject>().extract<null>().not.toBeNever()
  })

  it('should extract number', () => {
    expectTypeOf<TestSubject>().extract<number>().not.toBeNever()
  })
})

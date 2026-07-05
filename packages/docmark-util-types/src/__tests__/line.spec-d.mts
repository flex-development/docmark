/**
 * @file Type Tests - Line
 * @module docmark-util-types/tests/unit-d/Line
 */

import { describe, expectTypeOf, it } from 'vitest'
import type TestSubject from '../line.mts'

describe('unit-d:Line', () => {
  it('should equal number', () => {
    expectTypeOf<TestSubject>().toEqualTypeOf<number>()
  })
})

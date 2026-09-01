/**
 * @file Type Tests - Lazy
 * @module docmark-util-types/tests/unit-d/Lazy
 */

import type { Line } from '@flex-development/docmark-util-types'
import { describe, expectTypeOf, it } from 'vitest'
import type TestSubject from '../lazy.mts'

describe('unit-d:Lazy', () => {
  it('should match [[x: Line]: boolean]', () => {
    expectTypeOf<TestSubject>().toHaveProperty<Line>(2).toEqualTypeOf<boolean>()
  })
})

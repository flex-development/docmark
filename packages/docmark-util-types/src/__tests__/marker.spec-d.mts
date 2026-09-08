/**
 * @file Type Tests - Marker
 * @module docmark-util-types/tests/unit-d/Marker
 */

import type { Code } from '@flex-development/docmark-util-types'
import { describe, expectTypeOf, it } from 'vitest'
import type TestSubject from '../marker.mts'

describe('unit-d:Marker', () => {
  it('should equal NonNullable<Code>', () => {
    expectTypeOf<TestSubject>().toEqualTypeOf<NonNullable<Code>>()
  })
})

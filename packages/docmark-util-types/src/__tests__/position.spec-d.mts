/**
 * @file Type Tests - Position
 * @module docmark-util-types/tests/unit-d/Position
 */

import type { Place } from '@flex-development/docmark-util-types'
import type TestSubject from '../position.mts'

describe('unit-d:interfaces/Position', () => {
  it('should match [end: Place]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('end').toEqualTypeOf<Place>()
  })

  it('should match [start: Place]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('start').toEqualTypeOf<Place>()
  })
})

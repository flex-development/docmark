/**
 * @file Type Tests - Place
 * @module docmark-util-types/tests/unit-d/Place
 */

import type { Point } from '@flex-development/docmark-util-types'
import type TestSubject from '../place.mts'

describe('unit-d:interfaces/Place', () => {
  it('should extend Point', () => {
    expectTypeOf<TestSubject>().toExtend<Point>()
  })

  it('should match [_bufferIndex: number]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('_bufferIndex')
      .toEqualTypeOf<number>()
  })

  it('should match [_index: number]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('_index').toEqualTypeOf<number>()
  })
})

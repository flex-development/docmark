/**
 * @file Type Tests - Point
 * @module docmark-util-types/tests/unit-d/Point
 */

import type { Column, Line, Offset } from '@flex-development/docmark-util-types'
import type TestSubject from '../point.mts'

describe('unit-d:interfaces/Point', () => {
  it('should match [column: Column]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('column').toEqualTypeOf<Column>()
  })

  it('should match [line: Line]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('line').toEqualTypeOf<Line>()
  })

  it('should match [offset: Offset]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('offset').toEqualTypeOf<Offset>()
  })
})

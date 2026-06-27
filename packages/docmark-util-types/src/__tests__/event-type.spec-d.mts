/**
 * @file Type Tests - EventType
 * @module docmark-util-types/tests/unit-d/EventType
 */

import type TestSubject from '../event-type.mts'

describe('unit-d:EventType', () => {
  it('should extract "enter"', () => {
    expectTypeOf<TestSubject>().extract<'enter'>().not.toBeNever()
  })

  it('should extract "exit"', () => {
    expectTypeOf<TestSubject>().extract<'exit'>().not.toBeNever()
  })
})

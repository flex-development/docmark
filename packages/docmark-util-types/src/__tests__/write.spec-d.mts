/**
 * @file Type Tests - Write
 * @module docmark-util-types/tests/unit-d/Write
 */

import type { Chunk, Event } from '@flex-development/docmark-util-types'
import type TestSubject from '../write.mts'

describe('unit-d:types/Write', () => {
  it('should match [this: void]', () => {
    expectTypeOf<TestSubject>().thisParameter.toEqualTypeOf<void>()
  })

  describe('parameters', () => {
    it('should be callable with [Chunk[]]', () => {
      expectTypeOf<TestSubject>().parameters.toEqualTypeOf<[Chunk[]]>()
    })
  })

  describe('returns', () => {
    it('should return Event[]', () => {
      expectTypeOf<TestSubject>().returns.toEqualTypeOf<Event[]>()
    })
  })
})

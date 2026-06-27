/**
 * @file Type Tests - Resolver
 * @module docmark-util-types/tests/unit-d/Resolver
 */

import type {
  Event,
  TokenizeContext
} from '@flex-development/docmark-util-types'
import type TestSubject from '../resolver.mts'

describe('unit-d:Resolver', () => {
  it('should match [this: void]', () => {
    expectTypeOf<TestSubject>().thisParameter.toEqualTypeOf<void>()
  })

  describe('parameters', () => {
    it('should be callable with [Event[], TokenizeContext]', () => {
      expectTypeOf<TestSubject>()
        .parameters
        .toEqualTypeOf<[Event[], TokenizeContext]>()
    })
  })

  describe('returns', () => {
    it('should return Event[]', () => {
      expectTypeOf<TestSubject>().returns.toEqualTypeOf<Event[]>()
    })
  })
})

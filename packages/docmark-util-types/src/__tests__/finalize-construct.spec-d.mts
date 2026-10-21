/**
 * @file Type Tests - FinalizeConstruct
 * @module docmark-util-types/tests/unit-d/FinalizeConstruct
 */

import type {
  Construct,
  ContinuableConstruct
} from '@flex-development/docmark-util-types'
import { describe, expectTypeOf, it } from 'vitest'
import type TestSubject from '../finalize-construct.mts'

describe('unit-d:FinalizeConstruct', () => {
  it('should match [this: void]', () => {
    expectTypeOf<TestSubject>().thisParameter.toEqualTypeOf<void>()
  })

  describe('parameters', () => {
    it('should be callable with [U]', () => {
      expectTypeOf<TestSubject>().parameters.toEqualTypeOf<[Construct]>()
      expectTypeOf<TestSubject<ContinuableConstruct>>()
        .parameters
        .toEqualTypeOf<[ContinuableConstruct]>()
    })
  })

  describe('returns', () => {
    it('should return undefined', () => {
      expectTypeOf<TestSubject>().returns.toEqualTypeOf<undefined>()
    })
  })
})

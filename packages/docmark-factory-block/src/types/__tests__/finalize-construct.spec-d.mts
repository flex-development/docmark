/**
 * @file Type Tests - FinalizeConstruct
 * @module docmark-factory-block/types/tests/unit-d/FinalizeConstruct
 */

import type { ContinuableConstruct } from '@flex-development/docmark-util-types'
import { describe, expectTypeOf, it } from 'vitest'
import type TestSubject from '../finalize-construct.mts'

describe('unit-d:FinalizeConstruct', () => {
  it('should match [this: void]', () => {
    expectTypeOf<TestSubject>().thisParameter.toEqualTypeOf<void>()
  })

  describe('parameters', () => {
    it('should be callable with [ContinuableConstruct]', () => {
      expectTypeOf<TestSubject>()
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

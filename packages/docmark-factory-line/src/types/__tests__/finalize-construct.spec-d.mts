/**
 * @file Type Tests - FinalizeConstruct
 * @module docmark-factory-line/types/tests/unit-d/FinalizeConstruct
 */

import type { ContinuableConstruct } from '@flex-development/docmark-util-types'
import { describe, expectTypeOf, it } from 'vitest'
import type TestSubject from '../finalize-construct.mts'

describe('unit-d:types/FinalizeConstruct', () => {
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

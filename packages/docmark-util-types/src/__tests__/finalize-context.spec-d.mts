/**
 * @file Type Tests - FinalizeContext
 * @module docmark-util-types/tests/unit-d/FinalizeContext
 */

import type { TokenizeContext } from '@flex-development/docmark-util-types'
import { describe, expectTypeOf, it } from 'vitest'
import type TestSubject from '../finalize-context.mts'

describe('unit-d:FinalizeContext', () => {
  it('should match [this: void]', () => {
    expectTypeOf<TestSubject>().thisParameter.toEqualTypeOf<void>()
  })

  describe('parameters', () => {
    it('should be callable with [TokenizeContext]', () => {
      expectTypeOf<TestSubject>().parameters.toEqualTypeOf<[TokenizeContext]>()
    })
  })

  describe('returns', () => {
    it('should return undefined', () => {
      expectTypeOf<TestSubject>().returns.toEqualTypeOf<undefined>()
    })
  })
})

/**
 * @file Type Tests - PreprocessOptions
 * @module docmark-util-types/tests/unit-d/PreprocessOptions
 */

import type { Nilable } from '@flex-development/tutils'
import { describe, expectTypeOf, it } from 'vitest'
import type TestSubject from '../preprocess-options.mts'

describe('unit-d:PreprocessOptions', () => {
  it('should match [tabSize?: number | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('tabSize')
      .toEqualTypeOf<Nilable<number>>()
  })
})

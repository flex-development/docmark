/**
 * @file Type Tests - LanguageOptions
 * @module docmark-util-types/tests/unit-d/LanguageOptions
 */

import type { OptionalKeys } from '@flex-development/tutils'
import { describe, expectTypeOf, it } from 'vitest'
import type TestSubject from '../language-options.mts'

describe('unit-d:LanguageOptions', () => {
  type Optional = OptionalKeys<TestSubject>

  it('should match [documentationOnly?: boolean | undefined]', () => {
    expectTypeOf<Optional>().extract<'documentationOnly'>().not.toBeNever()
    expectTypeOf<TestSubject>()
      .toHaveProperty('documentationOnly')
      .toEqualTypeOf<boolean | undefined>()
  })
})

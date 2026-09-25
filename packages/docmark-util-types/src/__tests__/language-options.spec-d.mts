/**
 * @file Type Tests - LanguageOptions
 * @module docmark-util-types/tests/unit-d/LanguageOptions
 */

import type { Nilable, OptionalKeys } from '@flex-development/tutils'
import { describe, expectTypeOf, it } from 'vitest'
import type TestSubject from '../language-options.mts'

describe('unit-d:LanguageOptions', () => {
  type Optional = OptionalKeys<TestSubject>

  it('should match [indented?: boolean | null | undefined]', () => {
    expectTypeOf<Optional>().extract<'indented'>().not.toBeNever()
    expectTypeOf<TestSubject>()
      .toHaveProperty('indented')
      .toEqualTypeOf<Nilable<boolean>>()
  })
})

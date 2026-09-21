/**
 * @file Type Tests - LanguageOptions
 * @module docmark-util-types/tests/unit-d/LanguageOptions
 */

import { describe, expectTypeOf, it } from 'vitest'
import type TestSubject from '../language-options.mts'

describe('unit-d:LanguageOptions', () => {
  it('should register custom options', () => {
    expectTypeOf<keyof TestSubject>().toEqualTypeOf<'codeTags'>()
  })
})

/**
 * @file Type Tests - Language
 * @module docmark-util-types/tests/unit-d/Language
 */

import type { LanguageMap } from '@flex-development/docmark-util-types'
import { describe, expectTypeOf, it } from 'vitest'
import type TestSubject from '../language.mts'

describe('unit-d:Language', () => {
  it('should equal LanguageMap[keyof LanguageMap]', () => {
    expectTypeOf<TestSubject>().toEqualTypeOf<LanguageMap[keyof LanguageMap]>()
  })
})

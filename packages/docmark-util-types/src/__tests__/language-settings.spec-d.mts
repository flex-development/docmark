/**
 * @file Type Tests - LanguageSettings
 * @module docmark-util-types/tests/unit-d/LanguageSettings
 */

import type {
  Language,
  LanguageOptions
} from '@flex-development/docmark-util-types'
import { describe, expectTypeOf, it } from 'vitest'
import type TestSubject from '../language-settings.mts'

describe('unit-d:LanguageSettings', () => {
  it('should match Partial<Record<Language, LanguageOptions | null | undefined>>', () => {
    // Arrange
    type Expect = Partial<Record<Language, LanguageOptions | null | undefined>>

    // Expect
    expectTypeOf<TestSubject>().toMatchObjectType<Expect>()
  })
})

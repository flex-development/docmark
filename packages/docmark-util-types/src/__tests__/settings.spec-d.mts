/**
 * @file Type Tests - Settings
 * @module docmark-util-types/tests/unit-d/Settings
 */

import type {
  LanguageOptions,
  LanguageSettings
} from '@flex-development/docmark-util-types'
import { describe, expectTypeOf, it } from 'vitest'
import type TestSubject from '../settings.mts'

describe('unit-d:Settings', () => {
  it('should extend LanguageSettings', () => {
    expectTypeOf<TestSubject>().toExtend<LanguageSettings>()
  })

  it('should register custom settings', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('javascript')
      .not.toEqualTypeOf<LanguageOptions>()
  })
})

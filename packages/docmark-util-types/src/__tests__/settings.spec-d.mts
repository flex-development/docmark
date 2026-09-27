/**
 * @file Type Tests - Settings
 * @module docmark-util-types/tests/unit-d/Settings
 */

import type { LanguageSettings } from '@flex-development/docmark-util-types'
import { describe, expectTypeOf, it } from 'vitest'
import type TestSubject from '../settings.mts'

describe('unit-d:Settings', () => {
  it('should extend LanguageSettings', () => {
    expectTypeOf<TestSubject>().toExtend<LanguageSettings>()
  })
})

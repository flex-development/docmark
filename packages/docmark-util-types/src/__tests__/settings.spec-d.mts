/**
 * @file Type Tests - Settings
 * @module docmark-util-types/tests/unit-d/Settings
 */

import type {
  LanguageSettings,
  Modes
} from '@flex-development/docmark-util-types'
import type { OptionalKeys } from '@flex-development/tutils'
import { describe, expectTypeOf, it } from 'vitest'
import type TestSubject from '../settings.mts'

describe('unit-d:Settings', () => {
  type Optional = OptionalKeys<TestSubject>

  it('should extend LanguageSettings', () => {
    expectTypeOf<TestSubject>().toExtend<LanguageSettings>()
  })

  it('should match [modes?: Modes | undefined]', () => {
    expectTypeOf<Optional>().extract<'modes'>().not.toBeNever()
    expectTypeOf<TestSubject>()
      .toHaveProperty('modes')
      .toEqualTypeOf<Modes | undefined>()
  })
})

/**
 * @file Type Tests - Mode
 * @module docmark-util-types/tests/unit-d/Mode
 */

import type { ModeMap } from '@flex-development/docmark-util-types'
import { describe, expectTypeOf, it } from 'vitest'
import type TestSubject from '../mode.mts'

describe('unit-d:Mode', () => {
  it('should equal ModeMap[keyof ModeMap]', () => {
    expectTypeOf<TestSubject>().toEqualTypeOf<ModeMap[keyof ModeMap]>()
  })
})

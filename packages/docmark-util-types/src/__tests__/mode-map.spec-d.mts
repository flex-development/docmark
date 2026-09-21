/**
 * @file Type Tests - ModeMap
 * @module docmark-util-types/tests/unit-d/ModeMap
 */

import type { RequiredKeys } from '@flex-development/tutils'
import { describe, expectTypeOf, it } from 'vitest'
import type TestSubject from '../mode-map.mts'

describe('unit-d:ModeMap', () => {
  type Required = RequiredKeys<TestSubject>

  it('should match [documentation: "documentation"]', () => {
    expectTypeOf<Required>().extract<'documentation'>().not.toBeNever()
    expectTypeOf<TestSubject>()
      .toHaveProperty('documentation')
      .toEqualTypeOf<'documentation'>()
  })

  it('should match [null: null]', () => {
    expectTypeOf<Required>().extract<'null'>().not.toBeNever()
    expectTypeOf<TestSubject>().toHaveProperty('null').toEqualTypeOf<null>()
  })
})

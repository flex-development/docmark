/**
 * @file Type Tests - SerializeOptions
 * @module docmark-util-types/tests/unit-d/SerializeOptions
 */

import type { Nilable } from '@flex-development/tutils'
import type TestSubject from '../serialize-options.mts'

describe('unit-d:interfaces/SerializeOptions', () => {
  it('should match [breaks?: boolean | string | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('breaks')
      .toEqualTypeOf<Nilable<boolean | string>>()
  })

  it('should match [expandTabs?: boolean | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('expandTabs')
      .toEqualTypeOf<Nilable<boolean>>()
  })
})

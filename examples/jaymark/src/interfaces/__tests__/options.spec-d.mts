/**
 * @file Type Tests - Options
 * @module examples/jaymark/interfaces/tests/unit-d/Options
 */

import type { Nilable, OptionalKeys } from '@flex-development/tutils'
import { describe, expectTypeOf, it } from 'vitest'
import type TestSubject from '../options.mts'

describe('unit-d:jaymark/interfaces/Options', () => {
  type Optional = OptionalKeys<TestSubject>

  it('should match [comments?: boolean | null | undefined]', () => {
    expectTypeOf<Optional>().extract<'comments'>().not.toBeNever()
    expectTypeOf<TestSubject>()
      .toHaveProperty('comments')
      .toEqualTypeOf<Nilable<boolean>>()
  })

  it('should match [docs?: boolean | null | undefined]', () => {
    expectTypeOf<Optional>().extract<'docs'>().not.toBeNever()
    expectTypeOf<TestSubject>()
      .toHaveProperty('docs')
      .toEqualTypeOf<Nilable<boolean>>()
  })
})

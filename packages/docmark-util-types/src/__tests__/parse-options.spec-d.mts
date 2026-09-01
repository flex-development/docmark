/**
 * @file Type Tests - ParseOptions
 * @module docmark-util-types/tests/unit-d/ParseOptions
 */

import type {
  AnyExtension,
  FinalizeContext,
  InitialConstructs
} from '@flex-development/docmark-util-types'
import type { Nilable } from '@flex-development/tutils'
import { describe, expectTypeOf, it } from 'vitest'
import type TestSubject from '../parse-options.mts'

describe('unit-d:ParseOptions', () => {
  it('should match [extensions?: AnyExtension[] | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('extensions')
      .toEqualTypeOf<Nilable<AnyExtension[]>>()
  })

  it('should match [finalizeContext?: FinalizeContext | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('finalizeContext')
      .toEqualTypeOf<Nilable<FinalizeContext>>()
  })

  it('should match [initializers?: Partial<InitialConstructs> | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('initializers')
      .toEqualTypeOf<Nilable<Partial<InitialConstructs>>>()
  })
})

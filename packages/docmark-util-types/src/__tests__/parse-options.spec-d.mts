/**
 * @file Type Tests - ParseOptions
 * @module docmark-util-types/tests/unit-d/ParseOptions
 */

import type { Extension } from '@flex-development/docmark-util-types'
import type { List } from '@flex-development/mark/core'
import type { Nilable } from '@flex-development/tutils'
import { describe, expectTypeOf, it } from 'vitest'
import type TestSubject from '../parse-options.mts'

describe('unit-d:ParseOptions', () => {
  it('should match [extensions?: List<Extension> | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('extensions')
      .toEqualTypeOf<Nilable<List<Extension>>>()
  })
})

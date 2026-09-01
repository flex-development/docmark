/**
 * @file Type Tests - AnyExtension
 * @module docmark-util-types/tests/unit-d/AnyExtension
 */

import type { Extension } from '@flex-development/docmark-util-types'
import type * as micromark from 'micromark-util-types'
import { describe, expectTypeOf, it } from 'vitest'
import type TestSubject from '../any-extension.mts'

describe('unit-d:AnyExtension', () => {
  it('should extract Extension', () => {
    expectTypeOf<TestSubject>().extract<Extension>().not.toBeNever()
  })

  it('should extract micromark.Extension', () => {
    expectTypeOf<TestSubject>().extract<micromark.Extension>().not.toBeNever()
  })
})

/**
 * @file Type Tests - AnyConstruct
 * @module docmark-util-types/tests/unit-d/AnyConstruct
 */

import type { Construct } from '@flex-development/docmark-util-types'
import type * as micromark from 'micromark-util-types'
import { describe, expectTypeOf, it } from 'vitest'
import type TestSubject from '../any-construct.mts'

describe('unit-d:AnyConstruct', () => {
  it('should extract Construct', () => {
    expectTypeOf<TestSubject>().extract<Construct>().not.toBeNever()
  })

  it('should extract micromark.Construct', () => {
    expectTypeOf<TestSubject>().extract<micromark.Construct>().not.toBeNever()
  })
})

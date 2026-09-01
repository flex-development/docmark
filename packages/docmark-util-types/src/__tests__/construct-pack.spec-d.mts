/**
 * @file Type Tests - ConstructPack
 * @module docmark-util-types/tests/unit-d/ConstructPack
 */

import type { AnyConstruct } from '@flex-development/docmark-util-types'
import { describe, expectTypeOf, it } from 'vitest'
import type TestSubject from '../construct-pack.mts'

describe('unit-d:ConstructPack', () => {
  it('should extract AnyConstruct', () => {
    expectTypeOf<TestSubject>().extract<AnyConstruct>().not.toBeNever()
  })

  it('should extract AnyConstruct[]', () => {
    expectTypeOf<TestSubject>().extract<AnyConstruct[]>().not.toBeNever()
  })
})

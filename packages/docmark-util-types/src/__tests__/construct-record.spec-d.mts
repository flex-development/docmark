/**
 * @file Type Tests - ConstructRecord
 * @module docmark-util-types/tests/unit-d/ConstructRecord
 */

import type { ConstructPack } from '@flex-development/docmark-util-types'
import { describe, expectTypeOf, it } from 'vitest'
import type TestSubject from '../construct-record.mts'

describe('unit-d:ConstructRecord', () => {
  it('should match [[x: Numeric]: ConstructPack | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('42')
      .toEqualTypeOf<ConstructPack | undefined>()
  })

  it('should match [[x: number]: ConstructPack | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty(32)
      .toEqualTypeOf<ConstructPack | undefined>()
  })

  it('should match [null?: ConstructPack | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('null')
      .toEqualTypeOf<ConstructPack | undefined>()
  })
})

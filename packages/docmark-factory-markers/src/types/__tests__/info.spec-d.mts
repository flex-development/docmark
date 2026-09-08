/**
 * @file Type Tests - Info
 * @module docmark-factory-markers/tests/unit-d/Info
 */

import type { Marker, TokenType } from '@flex-development/docmark-util-types'
import type { OptionalKeys } from '@flex-development/tutils'
import { describe, expectTypeOf, it } from 'vitest'
import type TestSubject from '../info.mts'

describe('unit-d:types/Info', () => {
  it('should match [0: Marker]', () => {
    expectTypeOf<TestSubject>().toHaveProperty(0).toEqualTypeOf<Marker>()
  })

  it('should match [1?: TokenType | undefined]', () => {
    expectTypeOf<OptionalKeys<TestSubject>>().extract<1>().not.toBeNever()
    expectTypeOf<TestSubject>()
      .toHaveProperty(1)
      .toEqualTypeOf<TokenType | undefined>()
  })

  it('should match [length: 1 | 2]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('length').toEqualTypeOf<1 | 2>()
  })
})

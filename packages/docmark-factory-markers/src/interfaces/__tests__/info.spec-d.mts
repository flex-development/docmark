/**
 * @file Type Tests - Info
 * @module docmark-factory-markers/interfaces/tests/unit-d/Info
 */

import type {
  Marker,
  TokenFields,
  TokenType
} from '@flex-development/docmark-util-types'
import type { CodeCheck } from '@flex-development/mark/parse'
import type {
  Nilable,
  OptionalKeys,
  RequiredKeys
} from '@flex-development/tutils'
import { describe, expectTypeOf, it } from 'vitest'
import type TestSubject from '../info.mts'

describe('unit-d:interfaces/Info', () => {
  type Optional = OptionalKeys<TestSubject>
  type Required = RequiredKeys<TestSubject>

  it('should match [code: CodeCheck | Marker]', () => {
    expectTypeOf<Required>().extract<'code'>().not.toBeNever()
    expectTypeOf<TestSubject>()
      .toHaveProperty('code')
      .toEqualTypeOf<CodeCheck | Marker>()
  })

  it('should match [fields?: TokenFields | null | undefined]', () => {
    expectTypeOf<Optional>().extract<'fields'>().not.toBeNever()
    expectTypeOf<TestSubject>()
      .toHaveProperty('fields')
      .toEqualTypeOf<Nilable<TokenFields>>()
  })

  it('should match [optional?: boolean | undefined]', () => {
    expectTypeOf<Optional>().extract<'optional'>().not.toBeNever()
    expectTypeOf<TestSubject>()
      .toHaveProperty('optional')
      .toEqualTypeOf<boolean | undefined>()
  })

  it('should match [type?: TokenType | null | undefined]', () => {
    expectTypeOf<Optional>().extract<'type'>().not.toBeNever()
    expectTypeOf<TestSubject>()
      .toHaveProperty('type')
      .toEqualTypeOf<Nilable<TokenType>>()
  })
})

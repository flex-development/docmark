/**
 * @file Type Tests - Options
 * @module docmark-factory-line/interfaces/tests/unit-d/Options
 */

import type {
  AllowIndentedLines,
  CreateMarkers,
  FinalizeConstruct,
  Markers
} from '@flex-development/docmark-factory-line'
import type {
  Construct,
  CreateFields,
  TokenFields
} from '@flex-development/docmark-util-types'
import type {
  Nilable,
  OptionalKeys,
  RequiredKeys
} from '@flex-development/tutils'
import { describe, expectTypeOf, it } from 'vitest'
import type TestSubject from '../options.mts'

describe('unit-d:interfaces/Options', () => {
  type Optional = OptionalKeys<TestSubject>
  type Required = RequiredKeys<TestSubject>

  it('should match [allowIndentedContinuation?: AllowIndentedLines | boolean | undefined]', () => {
    expectTypeOf<Optional>()
      .extract<'allowIndentedContinuation'>()
      .not.toBeNever()
    expectTypeOf<TestSubject>()
      .toHaveProperty('allowIndentedContinuation')
      .toEqualTypeOf<AllowIndentedLines | boolean | undefined>()
  })

  it('should match [construct?: Partial<Construct> | null | undefined]', () => {
    expectTypeOf<Optional>().extract<'construct'>().not.toBeNever()
    expectTypeOf<TestSubject>()
      .toHaveProperty('construct')
      .toEqualTypeOf<Nilable<Partial<Construct>>>()
  })

  it('should match [fields?: CreateFields | TokenFields | null | undefined]', () => {
    expectTypeOf<Optional>().extract<'fields'>().not.toBeNever()
    expectTypeOf<TestSubject>()
      .toHaveProperty('fields')
      .toEqualTypeOf<Nilable<CreateFields | TokenFields>>()
  })

  it('should match [finalizeConstruct?: FinalizeConstruct | null | undefined]', () => {
    expectTypeOf<Optional>().extract<'finalizeConstruct'>().not.toBeNever()
    expectTypeOf<TestSubject>()
      .toHaveProperty('finalizeConstruct')
      .toEqualTypeOf<Nilable<FinalizeConstruct>>()
  })

  it('should match [markers: CreateMarkers | Markers]', () => {
    expectTypeOf<Required>().extract<'markers'>().not.toBeNever()
    expectTypeOf<TestSubject>()
      .toHaveProperty('markers')
      .toEqualTypeOf<CreateMarkers | Markers>()
  })
})

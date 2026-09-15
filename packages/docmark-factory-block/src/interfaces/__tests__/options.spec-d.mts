/**
 * @file Type Tests - Options
 * @module docmark-factory-block/interfaces/tests/unit-d/Options
 */

import type { Markers } from '@flex-development/docmark-factory-block'
import type {
  Construct,
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

  it('should match [construct?: Partial<Construct> | null | undefined]', () => {
    expectTypeOf<Optional>().extract<'construct'>().not.toBeNever()
    expectTypeOf<TestSubject>()
      .toHaveProperty('construct')
      .toEqualTypeOf<Nilable<Partial<Construct>>>()
  })

  it('should match [fields?: TokenFields | null | undefined]', () => {
    expectTypeOf<Optional>().extract<'fields'>().not.toBeNever()
    expectTypeOf<TestSubject>()
      .toHaveProperty('fields')
      .toEqualTypeOf<Nilable<Partial<TokenFields>>>()
  })

  it('should match [markers: Marker | Sequence]', () => {
    expectTypeOf<Required>().extract<'markers'>().not.toBeNever()
    expectTypeOf<TestSubject>()
      .toHaveProperty('markers')
      .toEqualTypeOf<Markers>()
  })
})

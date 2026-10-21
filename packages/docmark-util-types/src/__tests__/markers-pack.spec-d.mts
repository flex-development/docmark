/**
 * @file Type Tests - MarkersPack
 * @module docmark-util-types/tests/unit-d/MarkersPack
 */

import type {
  Marker,
  MarkerInfo,
  Markers
} from '@flex-development/docmark-util-types'
import type { OptionalKeys, RequiredKeys } from '@flex-development/tutils'
import { describe, expectTypeOf, it } from 'vitest'
import type TestSubject from '../markers-pack.mts'

describe('unit-d:MarkersPack', () => {
  type Optional = OptionalKeys<TestSubject>
  type Required = RequiredKeys<TestSubject>

  it('should match [closer: Markers]', () => {
    expectTypeOf<Required>().extract<'closer'>().not.toBeNever()
    expectTypeOf<TestSubject>()
      .toHaveProperty('closer')
      .toEqualTypeOf<Markers>()
  })

  it('should match [line?: Marker | MarkerInfo | undefined]', () => {
    expectTypeOf<Optional>().extract<'line'>().not.toBeNever()
    expectTypeOf<TestSubject>()
      .toHaveProperty('line')
      .toEqualTypeOf<Marker | MarkerInfo | undefined>()
  })

  it('should match [opener: Markers]', () => {
    expectTypeOf<Required>().extract<'opener'>().not.toBeNever()
    expectTypeOf<TestSubject>()
      .toHaveProperty('opener')
      .toEqualTypeOf<Markers>()
  })
})

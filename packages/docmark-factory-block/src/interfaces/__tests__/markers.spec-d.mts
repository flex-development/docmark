/**
 * @file Type Tests - Markers
 * @module docmark-factory-block/interfaces/tests/unit-d/Markers
 */

import type { Info, Sequence } from '@flex-development/docmark-factory-markers'
import type { Marker } from '@flex-development/docmark-util-types'
import type { OptionalKeys, RequiredKeys } from '@flex-development/tutils'
import { describe, expectTypeOf, it } from 'vitest'
import type TestSubject from '../markers.mts'

describe('unit-d:interfaces/Markers', () => {
  type Optional = OptionalKeys<TestSubject>
  type Required = RequiredKeys<TestSubject>

  it('should match [closer: Info | Marker | Sequence]', () => {
    expectTypeOf<Required>().extract<'closer'>().not.toBeNever()
    expectTypeOf<TestSubject>()
      .toHaveProperty('closer')
      .toEqualTypeOf<Info | Marker | Sequence>()
  })

  it('should match [line?: Info | Marker | undefined]', () => {
    expectTypeOf<Optional>().extract<'line'>().not.toBeNever()
    expectTypeOf<TestSubject>()
      .toHaveProperty('line')
      .toEqualTypeOf<Info | Marker | undefined>()
  })

  it('should match [opener: Info | Marker | Sequence]', () => {
    expectTypeOf<Required>().extract<'opener'>().not.toBeNever()
    expectTypeOf<TestSubject>()
      .toHaveProperty('opener')
      .toEqualTypeOf<Info | Marker | Sequence>()
  })
})

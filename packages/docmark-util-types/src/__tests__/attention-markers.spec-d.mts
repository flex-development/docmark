/**
 * @file Type Tests - AttentionMarkers
 * @module docmark-util-types/tests/unit-d/AttentionMarkers
 */

import type { Marker } from '@flex-development/docmark-util-types'
import type { OptionalKeys } from '@flex-development/tutils'
import { describe, expectTypeOf, it } from 'vitest'
import type TestSubject from '../attention-markers.mts'

describe('unit-d:AttentionMarkers', () => {
  it('should match [null?: Marker[] | undefined]', () => {
    expectTypeOf<OptionalKeys<TestSubject>>().extract<'null'>().not.toBeNever()
    expectTypeOf<TestSubject>()
      .toHaveProperty('null')
      .toEqualTypeOf<Marker[] | undefined>()
  })
})

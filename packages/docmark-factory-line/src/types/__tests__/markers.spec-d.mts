/**
 * @file Type Tests - Markers
 * @module docmark-factory-line/types/tests/unit-d/Markers
 */

import type { Info, Sequence } from '@flex-development/docmark-factory-markers'
import type { Marker } from '@flex-development/docmark-util-types'
import { describe, expectTypeOf, it } from 'vitest'
import type TestSubject from '../markers.mts'

describe('unit-d:Markers', () => {
  it('should extract Info', () => {
    expectTypeOf<TestSubject>().extract<Info>().not.toBeNever()
  })

  it('should extract Marker', () => {
    expectTypeOf<TestSubject>().extract<Marker>().not.toBeNever()
  })

  it('should extract Sequence', () => {
    expectTypeOf<TestSubject>().extract<Sequence>().not.toBeNever()
  })
})

/**
 * @file Type Tests - Markers
 * @module docmark-util-types/tests/unit-d/Markers
 */

import type {
  Marker,
  MarkerInfo,
  MarkerSequence
} from '@flex-development/docmark-util-types'
import { describe, expectTypeOf, it } from 'vitest'
import type TestSubject from '../markers.mts'

describe('unit-d:Markers', () => {
  it('should extract Marker', () => {
    expectTypeOf<TestSubject>().extract<Marker>().not.toBeNever()
  })

  it('should extract MarkerInfo', () => {
    expectTypeOf<TestSubject>().extract<MarkerInfo>().not.toBeNever()
  })

  it('should extract MarkerSequence', () => {
    expectTypeOf<TestSubject>().extract<MarkerSequence>().not.toBeNever()
  })
})

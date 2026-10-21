/**
 * @file Type Tests - MarkerSequence
 * @module docmark-util-types/tests/unit-d/MarkerSequence
 */

import type { Marker, MarkerInfo } from '@flex-development/docmark-util-types'
import type { CodeCheck } from '@flex-development/mark/parse'
import { describe, expectTypeOf, it } from 'vitest'
import type TestSubject from '../marker-sequence.mts'

describe('unit-d:MarkerSequence', () => {
  it('should allow `1` element', () => {
    expectTypeOf<[35]>().toExtend<TestSubject>()
  })

  it('should allow more than `1` element', () => {
    expectTypeOf<[47, 47]>().toExtend<TestSubject>()
  })

  it('should match [0: CodeCheck | Marker | MarkerInfo]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty(0)
      .toEqualTypeOf<CodeCheck | Marker | MarkerInfo>()
  })

  it('should match [length: number]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('length').toEqualTypeOf<number>()
  })

  it('should not allow `0` elements', () => {
    expectTypeOf<[]>().not.toExtend<TestSubject>()
  })
})

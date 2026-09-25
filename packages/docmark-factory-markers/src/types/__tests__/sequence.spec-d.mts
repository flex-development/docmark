/**
 * @file Type Tests - Sequence
 * @module docmark-factory-markers/tests/unit-d/Sequence
 */

import type { Info } from '@flex-development/docmark-factory-markers'
import type { Marker } from '@flex-development/docmark-util-types'
import type { CodeCheck } from '@flex-development/mark/parse'
import { describe, expectTypeOf, it } from 'vitest'
import type TestSubject from '../sequence.mts'

describe('unit-d:types/Sequence', () => {
  it('should allow `1` element', () => {
    expectTypeOf<[35]>().toExtend<TestSubject>()
  })

  it('should allow more than `1` element', () => {
    expectTypeOf<[47, 47]>().toExtend<TestSubject>()
  })

  it('should match [0: CodeCheck |Info | Marker]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty(0)
      .toEqualTypeOf<CodeCheck | Info | Marker>()
  })

  it('should match [length: number]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('length').toEqualTypeOf<number>()
  })

  it('should not allow `0` elements', () => {
    expectTypeOf<[]>().not.toExtend<TestSubject>()
  })
})

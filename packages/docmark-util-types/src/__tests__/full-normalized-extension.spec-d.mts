/**
 * @file Type Tests - FullNormalizedExtension
 * @module docmark-util-types/tests/unit-d/FullNormalizedExtension
 */

import type {
  AnyExtension,
  Extension,
  NormalizedExtension
} from '@flex-development/docmark-util-types'
import { describe, expectTypeOf, it } from 'vitest'
import type TestSubject from '../full-normalized-extension.mts'

describe('unit-d:FullNormalizedExtension', () => {
  it('should extend `AnyExtension`', () => {
    expectTypeOf<TestSubject>().toExtend<AnyExtension>()
  })

  it('should extend `NormalizedExtension`', () => {
    expectTypeOf<TestSubject>().toExtend<NormalizedExtension>()
  })

  it('should equal { [K in keyof Extension]-?: NonNullable<Extension[K]> }', () => {
    // Arrange
    type Expect = { [K in keyof Extension]-?: NonNullable<Extension[K]> }

    // Expect
    expectTypeOf<TestSubject>().toExtend<Expect>()
  })
})

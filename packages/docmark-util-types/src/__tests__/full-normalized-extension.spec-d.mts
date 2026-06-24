/**
 * @file Type Tests - FullNormalizedExtension
 * @module docmark-util-types/tests/unit-d/FullNormalizedExtension
 */

import type {
  ConstructRecord,
  ContentType,
  Extension,
  NormalizedExtension
} from '@flex-development/docmark-util-types'
import type { NIL } from '@flex-development/tutils'
import type TestSubject from '../full-normalized-extension.mts'

describe('unit-d:types/FullNormalizedExtension', () => {
  it('should extend `Extension`', () => {
    expectTypeOf<TestSubject>().toExtend<Extension>()
  })

  it('should extend `NormalizedExtension`', () => {
    expectTypeOf<TestSubject>().toExtend<NormalizedExtension>()
  })

  it('should require all `Extension` properties and remove `NIL`', () => {
    // Arrange
    type K = Exclude<keyof Extension, ContentType>
    type V = Exclude<Extension[K], NIL>
    type Expect = Record<K, V> & Record<ContentType, ConstructRecord>

    // Expect
    expectTypeOf<TestSubject>().toExtend<Expect>()
  })
})

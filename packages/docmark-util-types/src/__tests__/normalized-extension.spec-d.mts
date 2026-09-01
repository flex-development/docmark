/**
 * @file Type Tests - NormalizedExtension
 * @module docmark-util-types/tests/unit-d/NormalizedExtension
 */

import type {
  AnyExtension,
  ConstructRecord,
  ContentType,
  Extension
} from '@flex-development/docmark-util-types'
import type { NIL } from '@flex-development/tutils'
import { describe, expectTypeOf, it } from 'vitest'
import type TestSubject from '../normalized-extension.mts'

describe('unit-d:NormalizedExtension', () => {
  it('should extend `AnyExtension`', () => {
    expectTypeOf<TestSubject>().toExtend<AnyExtension>()
  })

  it('should remove `NIL` from `Extension` properties', () => {
    // Arrange
    type K = Exclude<keyof Extension, ContentType>
    type V = Exclude<Extension[K], NIL>
    type U = Record<K, V> & Record<ContentType, ConstructRecord>

    // Expect
    expectTypeOf<TestSubject>().toExtend<Partial<U>>()
  })
})

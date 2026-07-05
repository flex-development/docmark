/**
 * @file Type Tests - Encoding
 * @module docmark-util-types/tests/unit-d/Encoding
 */

import type { EncodingMap } from '@flex-development/docmark-util-types'
import { describe, expectTypeOf, it } from 'vitest'
import type TestSubject from '../encoding.mts'

describe('unit-d:Encoding', () => {
  it('should equal EncodingMap[keyof EncodingMap]', () => {
    expectTypeOf<TestSubject>().toEqualTypeOf<EncodingMap[keyof EncodingMap]>()
  })
})

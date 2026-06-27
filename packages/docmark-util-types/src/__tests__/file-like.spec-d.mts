/**
 * @file Type Tests - FileLike
 * @module docmark-util-types/tests/unit-d/FileLike
 */

import type { Value } from '@flex-development/docmark-util-types'
import type TestSubject from '../file-like.mts'

describe('unit-d:FileLike', () => {
  it('should match [value: Value]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('value').toEqualTypeOf<Value>()
  })
})

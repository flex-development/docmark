/**
 * @file Type Tests - ConstructRecord
 * @module docmark-util-types/tests/unit-d/ConstructRecord
 */

import type { Construct } from '@flex-development/docmark-util-types'
import type TestSubject from '../construct-record.mts'

describe('unit-d:ConstructRecord', () => {
  type Value = Construct | Construct[] | undefined

  it('should match [[x: Numeric]: Construct | Construct[] | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('42')
      .toEqualTypeOf<Value>()
  })

  it('should match [[x: number]: Construct | Construct[] | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty(32)
      .toEqualTypeOf<Value>()
  })

  it('should match [null?: Construct | Construct[] | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('null')
      .toEqualTypeOf<Value>()
  })
})

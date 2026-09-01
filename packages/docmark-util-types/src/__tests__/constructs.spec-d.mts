/**
 * @file Type Tests - Constructs
 * @module docmark-util-types/tests/unit-d/Constructs
 */

import type {
  ConstructPack,
  ConstructRecord
} from '@flex-development/docmark-util-types'
import { describe, expectTypeOf, it } from 'vitest'
import type TestSubject from '../constructs.mts'

describe('unit-d:Constructs', () => {
  it('should extract ConstructPack', () => {
    expectTypeOf<TestSubject>().extract<ConstructPack>().not.toBeNever()
  })

  it('should extract ConstructRecord', () => {
    expectTypeOf<TestSubject>().extract<ConstructRecord>().not.toBeNever()
  })
})

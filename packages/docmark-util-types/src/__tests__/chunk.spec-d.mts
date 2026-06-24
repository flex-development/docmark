/**
 * @file Type Tests - Chunk
 * @module docmark-util-types/tests/unit-d/Chunk
 */

import type { Code } from '@flex-development/docmark-util-types'
import type TestSubject from '../chunk.mts'

describe('unit-d:types/Chunk', () => {
  it('should extract Code', () => {
    expectTypeOf<TestSubject>().extract<Code>().not.toBeNever()
  })

  it('should extract string', () => {
    expectTypeOf<TestSubject>().extract<string>().not.toBeNever()
  })
})

/**
 * @file Type Tests - SliceStream
 * @module docmark-util-types/tests/unit-d/SliceStream
 */

import type { Chunk, Position } from '@flex-development/docmark-util-types'
import type TestSubject from '../slice-stream.mts'

describe('unit-d:types/SliceStream', () => {
  it('should match [this: void]', () => {
    expectTypeOf<TestSubject>().thisParameter.toEqualTypeOf<void>()
  })

  describe('parameters', () => {
    it('should be callable with [Position]', () => {
      expectTypeOf<TestSubject>().parameters.toEqualTypeOf<[Position]>()
    })
  })

  describe('returns', () => {
    it('should return Chunk[]', () => {
      expectTypeOf<TestSubject>().returns.toEqualTypeOf<Chunk[]>()
    })
  })
})

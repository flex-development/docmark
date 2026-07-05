/**
 * @file Type Tests - Preprocessor
 * @module docmark-util-types/tests/unit-d/Preprocessor
 */

import type {
  Chunk,
  Code,
  Encoding,
  FileLike,
  Value
} from '@flex-development/docmark-util-types'
import { describe, expectTypeOf, it } from 'vitest'
import type TestSubject from '../preprocessor.mts'

describe('unit-d:Preprocessor', () => {
  it('should match [this: void]', () => {
    expectTypeOf<TestSubject>().thisParameter.toEqualTypeOf<void>()
  })

  describe('parameters', () => {
    it('should be callable with [Code | FileLike | Value | undefined, (Encoding | null | undefined)?, (boolean | null | undefined)?]', () => {
      // Arrange
      type Expect = [
        value: Code | FileLike | Value | undefined,
        encoding?: Encoding | null | undefined,
        end?: boolean | null | undefined
      ]

      // Expect
      expectTypeOf<TestSubject>().parameters.extract<Expect>().not.toBeNever()
    })

    it('should be callable with [Code | FileLike | Value | undefined, (Encoding | null | undefined)?, (false | null | undefined)?]', () => {
      // Arrange
      type Expect = [
        value: Code | FileLike | Value | undefined,
        encoding?: Encoding | null | undefined,
        end?: false | null | undefined
      ]

      // Expect
      expectTypeOf<TestSubject>().parameters.extract<Expect>().not.toBeNever()
    })

    it('should be callable with [Code | FileLike | Value | undefined, Encoding | null | undefined, true]', () => {
      // Arrange
      type Expect = [
        value: Code | FileLike | Value | undefined,
        encoding: Encoding | null | undefined,
        end: true
      ]

      // Expect
      expectTypeOf<TestSubject>().parameters.extract<Expect>().not.toBeNever()
    })
  })

  describe('returns', () => {
    it('should return [...NonNullable<Chunk>[], null] | Chunk[] | NonNullable<Chunk>[]', () => {
      // Arrange
      type Expect = [...NonNullable<Chunk>[], null] | Chunk[] | NonNullable<
        Chunk
      >[]

      // Expect
      expectTypeOf<TestSubject>().returns.toEqualTypeOf<Expect>()
    })
  })
})

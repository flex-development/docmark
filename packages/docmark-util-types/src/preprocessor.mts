/**
 * @file Preprocessor
 * @module docmark-util-types/Preprocessor
 */

import type {
  Chunk,
  Code,
  Encoding,
  FileLike,
  Value
} from '@flex-development/docmark-util-types'

/**
 * Turn a code, file, or value into chunks.
 *
 * @see {@linkcode Chunk}
 * @see {@linkcode Code}
 * @see {@linkcode Encoding}
 * @see {@linkcode FileLike}
 * @see {@linkcode Value}
 */
type Preprocess = {
  /**
   * Turn `value` into chunks.
   *
   * @see {@linkcode Code}
   * @see {@linkcode Encoding}
   * @see {@linkcode FileLike}
   * @see {@linkcode Value}
   *
   * @this {void}
   *
   * @param {Code | FileLike | Value | undefined} value
   *  The code, file, or value to preprocess
   * @param {Encoding | null | undefined} encoding
   *  The character encoding to use when `value`
   *  or its contents is an {@linkcode Uint8Array}
   * @param {true} end
   *  Whether the end of stream has been reached
   * @return {[...NonNullable<Chunk>[], null]}
   *  The list of chunks
   */
  (
    this: void,
    value: Code | FileLike | Value | undefined,
    encoding: Encoding | null | undefined,
    end: true
  ): [...NonNullable<Chunk>[], null]

  /**
   * Turn `value` into chunks.
   *
   * @see {@linkcode Code}
   * @see {@linkcode Encoding}
   * @see {@linkcode FileLike}
   * @see {@linkcode Value}
   *
   * @this {void}
   *
   * @param {Code | FileLike | Value | undefined} value
   *  The code, file, or value to preprocess
   * @param {Encoding | null | undefined} encoding
   *  The character encoding to use when `value`
   *  or its contents is an {@linkcode Uint8Array}
   * @param {false | null | undefined} [end]
   *  Whether the end of stream has been reached
   * @return {NonNullable<Chunk>[]}
   *  The list of chunks
   */
  (
    this: void,
    value: Code | FileLike | Value | undefined,
    encoding?: Encoding | null | undefined,
    end?: false | null | undefined
  ): NonNullable<Chunk>[]

  /**
   * Turn `value` into chunks.
   *
   * @see {@linkcode Code}
   * @see {@linkcode Encoding}
   * @see {@linkcode FileLike}
   * @see {@linkcode Value}
   *
   * @this {void}
   *
   * @param {Code | FileLike | Value | undefined} value
   *  The code, file, or value to preprocess
   * @param {Encoding | null | undefined} [encoding]
   *  The character encoding to use when `value`
   *  or its contents is an {@linkcode Uint8Array}
   * @param {boolean | null | undefined} [end]
   *  Whether the end of stream has been reached
   * @return {Chunk[]}
   *  The list of chunks
   */
  (
    this: void,
    value: Code | FileLike | Value | undefined,
    encoding?: Encoding | null | undefined,
    end?: boolean | null | undefined
  ): Chunk[]
}

export type { Preprocess as default }

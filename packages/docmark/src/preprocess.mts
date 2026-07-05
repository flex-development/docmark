/**
 * @file preprocess
 * @module docmark/preprocess
 */

import { codes, constants } from '@flex-development/docmark-util-symbol'
import type {
  Chunk,
  Code,
  Encoding,
  FileLike,
  PreprocessOptions,
  Preprocessor,
  Value
} from '@flex-development/docmark-util-types'
import { decode } from '@flex-development/mark-parser/utils'
import { eol, htab } from '@flex-development/mark-util-character'

/**
 * Create a preprocessor to turn a value into chunks.
 *
 * @see {@linkcode Preprocessor}
 * @see {@linkcode PreprocessOptions}
 *
 * @this {void}
 *
 * @param {PreprocessOptions | null | undefined} [options]
 *  The configuration options
 * @return {Preprocessor}
 *  The preprocessor
 */
function preprocess(
  this: void,
  options?: PreprocessOptions | null | undefined
): Preprocessor {
  /**
   * The number of columns represented by a horizontal tab.
   *
   * @const {number} tabSize
   */
  const tabSize: number = options?.tabSize ?? constants.tabSize

  return preprocessor as Preprocessor

  /**
   * @this {void}
   *
   * @param {Code | FileLike | Value | undefined} value
   *  The code, file, or value to preprocess
   * @param {Encoding | null | undefined} [encoding]
   *  The character encoding to use when `value`
   *  or its contents is {@linkcode Uint8Array}
   * @param {boolean | null | undefined} [end]
   *  Whether the end of stream has been reached
   * @return {Chunk[]}
   *  The list of chunks
   */
  function preprocessor(
    this: void,
    value: Code | FileLike | Value | undefined,
    encoding?: Encoding | null | undefined,
    end?: boolean | null | undefined
  ): Chunk[] {
    /**
     * The list of chunks.
     *
     * @const {Chunk[]} chunks
     */
    const chunks: Chunk[] = []

    // add character code chunk.
    if (typeof value === 'number') {
      if (value !== codes.bos && value !== codes.empty) chunks.push(value)
      if (end) chunks.push(codes.eos)
      return chunks
    }

    // decode file or value and extract chunks.
    if (value !== null && value !== undefined) {
      /**
       * The decoded chunk.
       *
       * @var {Chunk | undefined} decoded
       */
      let decoded: Chunk | undefined = decode(value, encoding)

      if (typeof decoded === 'number') {
        if (end) chunks.push(codes.eos)
        return chunks
      }

      // value is now decoded.
      value = decoded

      /**
       * The current visual column.
       *
       * Used to determine how many virtual spaces follow a horizontal tab.
       *
       * @var {number} column
       */
      let column: number = 1

      /**
       * The index of the current character code.
       *
       * @var {number} index
       */
      let index: number = 0

      /**
       * The index to start the next string chunk at.
       *
       * @var {number} sliceIndex
       */
      let sliceIndex: number = 0

      // store chunks.
      while (index < value.length) {
        /**
         * The current character code.
         *
         * @const {NonNullable<Code>} code
         */
        const code: NonNullable<Code> = value.codePointAt(index)!

        /**
         * The difference between the next column and the current column.
         *
         * @var {number} k
         */
        let k: number = code > 0xffff ? 2 : 1

        // continue building string chunk.
        if (code !== codes.nul && !eol(code) && !htab(code)) {
          index += k
          continue
        }

        // string chunk before `nul`, eol, or horizontal tab.
        if (sliceIndex < index) {
          /**
           * The string chunk.
           *
           * @const {string} chunk
           */
          const chunk: string = value.slice(sliceIndex, index)

          chunks.push(chunk)
          column += [...chunk].length
        }

        // process character code.
        switch (code) {
          case codes.nul:
            chunks.push(codes.replacementCharacter)
            column++
            break
          case codes.ht:
            /**
             * The next column.
             *
             * @const {number} n
             */
            const n: number = Math.ceil(column / tabSize) * tabSize

            // normalize horizontal tab into virtual tab and spaces.
            chunks.push(codes.horizontalTab)
            while (column++ < n) chunks.push(codes.virtualSpace)

            break
          case codes.lf: // add virtual line feed.
            chunks.push(codes.lineFeed)
            column = 1
            break
          default: // carriage return.
            /**
             * The index of the next character code.
             *
             * @const {number} nextIndex
             */
            const nextIndex: number = index + 1

            /**
             * The next character code.
             *
             * @const {Code | undefined} next
             */
            const next: Code | undefined = value.codePointAt(nextIndex)

            if (next === codes.lf) {
              chunks.push(codes.carriageReturnLineFeed)
              index = nextIndex
            } else {
              chunks.push(codes.carriageReturn)
            }

            column = 1
            break
        }

        index += k
        sliceIndex = index
      }

      // final string chunk.
      if (sliceIndex < value.length) chunks.push(value.slice(sliceIndex))
    }

    return end && chunks.push(codes.eos), chunks
  }
}

export default preprocess

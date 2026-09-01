/**
 * @file Internal - eolset
 * @module docmark-util-subtokenize/internal/eolset
 */

import { codes } from '@flex-development/docmark-util-symbol'
import type { Code, Offset } from '@flex-development/docmark-util-types'

/**
 * Calculate the end offset of a line ending.
 *
 * @internal
 *
 * @this {void}
 *
 * @param {Code} code
 *  The character code to evaluate
 * @param {Offset} start
 *  The start offset
 * @return {Offset}
 *  The end offset
 */
function eolset(this: void, code: Code, start: Offset): Offset {
  return start + (code === codes.carriageReturnLineFeed ? 2 : 1)
}

export default eolset

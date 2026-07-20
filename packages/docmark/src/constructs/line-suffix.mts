/**
 * @file Constructs - lineSuffix
 * @module docmark/constructs/lineSuffix
 */

import { factorySpace } from '@flex-development/docmark-factory-space'
import { tt } from '@flex-development/docmark-util-symbol'
import type {
  Code,
  Effects,
  PartialConstruct,
  State,
  TokenizeContext
} from '@flex-development/docmark-util-types'
import { eol, eos, whitespace } from '@flex-development/mark-util-character'

/**
 * The line suffix construct.
 *
 * A line suffix consists of trailing whitespace at the end of a comment line.
 * Suffixes are expected to be removed from comment content before being written
 * to `comment` tokenizers.
 *
 * @const {PartialConstruct} lineSuffix
 */
const lineSuffix: PartialConstruct = {
  partial: true,
  tokenize: tokenizeLineSuffix
}

export default lineSuffix

/**
 * Tokenize a line suffix.
 *
 * Trailing whitespace is accepted only when it is immediately followed by the
 * end of the current physical line or end of stream.
 *
 * @this {TokenizeContext}
 *
 * @param {Effects} effects
 *  The context object to transition the state machine
 * @param {State} ok
 *  The successful tokenization state
 * @param {State} nok
 *  The failed tokenization state
 * @return {State}
 *  The initial state
 */
function tokenizeLineSuffix(
  this: TokenizeContext,
  effects: Effects,
  ok: State,
  nok: State
): State {
  return lineSuffixStart

  /**
   * Attempt to begin a line suffix.
   *
   * A line suffix begins with trailing whitespace.
   *
   * > 👉 **Note**: `␊` represents a line ending and `␠` represents a space.
   *
   * @example
   *  ```markdown
   *  > | * Tokenize a line suffix.␠␠␠␊
   *                               ^
   *  > | * @this {TokenizeContext}
   *  ```
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function lineSuffixStart(this: void, code: Code): State | undefined {
    if (!whitespace(code)) return nok(code)
    return factorySpace(effects, afterLineSuffix, tt.lineSuffix)(code)
  }

  /**
   * Finish a line suffix.
   *
   * A line suffix is recognized only when the consumed whitespace is
   * immediately followed by the end of the physical line or end of stream.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function afterLineSuffix(this: void, code: Code): State | undefined {
    if (!eos(code) && !eol(code)) return nok(code)
    return ok(code)
  }
}

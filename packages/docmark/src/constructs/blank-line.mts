/**
 * @file Constructs - blankLine
 * @module docmark/constructs/blankLine
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
import { eol, eos, space } from '@flex-development/mark-util-character'

/**
 * The blank line construct.
 *
 * @const {PartialConstruct} blankLine
 */
const blankLine: PartialConstruct = {
  partial: true,
  tokenize: tokenizeBlankLine
}

export default blankLine

/**
 * Tokenize a blank line.
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
function tokenizeBlankLine(
  this: TokenizeContext,
  effects: Effects,
  ok: State,
  nok: State
): State {
  return start

  /**
   * Start of blank line.
   *
   * > 👉 **Note**: `␊` represents a line ending.
   *
   * @example
   *  ```markdown
   *  > | * Tokenize a blank line.␊
   *  > | * ␊
   *       ^
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
  function start(this: void, code: Code): State | undefined {
    return space(code)
      ? factorySpace(effects, after, tt.linePrefix)(code)
      : after(code)
  }

  /**
   * At eof/eol, after optional whitespace.
   *
   * > 👉 **Note**: `␊` represents a line ending.
   *
   * @example
   *  ```markdown
   *  > | * Tokenize a blank line.␊
   *  > | *␊
   *       ^
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
  function after(this: void, code: Code): State | undefined {
    if (!eos(code) && !eol(code)) return nok(code)
    return ok(code)
  }
}

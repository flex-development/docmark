/**
 * @file Constructs - stringExpression
 * @module examples/jaymark/constructs/stringExpression
 */

import { codes, constants, tt } from '@flex-development/docmark-util-symbol'
import type {
  Code,
  Construct,
  Effects,
  State,
  TokenizeContext
} from '@flex-development/docmark-util-types'
import { eos } from '@flex-development/mark-util-character'
import jt from '../jt.mts'

/**
 * The string expression construct.
 *
 * @const {Construct} stringExpression
 */
const stringExpression: Construct = { tokenize: tokenizeStringExpression }

export default stringExpression

/**
 * Tokenize a string.
 *
 * @this {TokenizeContext}
 *
 * @param {Effects} effects
 *  The context object used to transition the state machine
 * @param {State} ok
 *  The successful tokenization state
 * @param {State} nok
 *  The failed tokenization state
 * @return {State}
 *  The initial state
 */
function tokenizeStringExpression(
  this: TokenizeContext,
  effects: Effects,
  ok: State,
  nok: State
): State {
  /**
   * The tokenization context.
   *
   * @const {TokenizeContext} self
   */
  const self: TokenizeContext = this

  /**
   * The number of consecutive backslashes immediately preceding the current
   * code.
   *
   * An odd-length run escapes a quotation mark.
   * The count is reset when a non-backslash character code is seen.
   *
   * @var {number} backslashes
   */
  let backslashes: number = 0

  return startString

  /**
   * Start a string expression.
   *
   * @example
   *  ```json
   *  {
   *    "url": "https://github.com/flex-development/docmark"
   *    ^
   *  }
   *  ```
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function startString(this: void, code: Code): State | undefined {
    if (code !== codes.quotationMark) return nok(code) // cannot start.

    // enter the string expression.
    effects.enter(jt.stringExpression)

    // capture the opening marker.
    effects.enter(jt.stringMarker, { _open: true })
    effects.consume(code)
    effects.exit(jt.stringMarker)

    // signal string parsing.
    self.parser.skipComment = true

    return afterOpener
  }

  /**
   * After the opening string marker.
   *
   * @example
   *  ```json
   *    ""
   *     ^
   *  ```
   *
   * @example
   *  ```json
   *  {
   *    "url": "https://github.com/flex-development/docmark"
   *     ^
   *  }
   *  ```
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function afterOpener(this: void, code: Code): State | undefined {
    if (code === codes.quotationMark) return endString(code) // empty string.
    if (eos(code)) return endString(code) // end of stream.
    return startChunk(code) // start string content chunk.
  }

  /**
   * Start a `string` content chunk.
   *
   * @example
   *  ```json
   *  {
   *    "url": "https://github.com/flex-development/docmark"
   *     ^
   *  }
   *  ```
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function startChunk(this: void, code: Code): State | undefined {
    effects.enter(tt.chunkString, { contentType: constants.contentTypeString })
    return insideString(code)
  }

  /**
   * Inside the `string` content chunk.
   *
   * @example
   *  ```json
   *  {
   *    "url": "https://github.com/flex-development/docmark"
   *     ^^^
   *  }
   *  ```
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function insideString(this: void, code: Code): State | undefined {
    if (code === codes.quotationMark || eos(code)) {
      effects.exit(tt.chunkString)
      return endString(code)
    }

    /**
     * Whether the current code is escaped by an odd-length run of immediately
     * preceding backslashes.
     *
     * @const {boolean} escaped
     */
    const escaped: boolean = backslashes % 2 === 1

    // extend the current run of consecutive backslashes.
    if (code === codes.backslash) {
      backslashes++
      return effects.consume(code), insideString
    }

    // reset the consecutive backslash count.
    backslashes = 0

    // an unescaped quotation mark ends the string.
    if (!escaped && code === codes.quotationMark) {
      effects.exit(tt.chunkString)
      return endString(code)
    }

    // add `code` to the current string content chunk.
    return effects.consume(code), insideString
  }

  /**
   * End a string expression.
   *
   * @example
   *  ```json
   *    ""
   *     ^
   *  ```
   *
   * @example
   *  ```json
   *  {
   *    "url": "https://github.com/flex-development/docmark"
   *        ^
   *  }
   *  ```
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function endString(this: void, code: Code): State | undefined {
    delete self.parser.skipComment // remove string parsing signal.

    // at end of stream.
    if (eos(code)) return ok(code)

    // capture the final marker.
    effects.enter(jt.stringMarker, { _close: true })
    effects.consume(code)
    effects.exit(jt.stringMarker)

    // exit the string expression.
    effects.exit(jt.stringExpression)
    return ok
  }
}

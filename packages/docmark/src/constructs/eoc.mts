/**
 * @file Constructs - eoc
 * @module docmark/constructs/eoc
 */

import type {
  Code,
  Effects,
  PartialConstruct,
  State,
  TokenizeContext
} from '@flex-development/docmark-util-types'
import { eol, eos } from '@flex-development/mark-util-character'

/**
 * The end-of-content construct.
 *
 * End of content consists of zero or more line endings followed by end of
 * stream.
 *
 * This construct is used when a caller must determine whether the remainder of
 * a content stream contains only blank lines. Line endings are consumed as part
 * of the partial attempt; failed attempts are restored by the caller.
 *
 * This construct is partial because it only checks for end of content.
 * The enclosing construct remains responsible for handling the recognized
 * content boundary.
 *
 * @const {PartialConstruct} eoc
 */
const eoc: PartialConstruct = { partial: true, tokenize: tokenizeEndOfContent }

export default eoc

/**
 * Tokenize end of content.
 *
 * Line endings are consumed until the first non-line-ending code is reached.
 * The construct succeeds if that code is end of stream and fails otherwise.
 *
 * End of stream is not consumed.
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
function tokenizeEndOfContent(
  this: TokenizeContext,
  effects: Effects,
  ok: State,
  nok: State
): State {
  return maybeEnd

  /**
   * Consume line endings before a possible end of content.
   *
   * The construct succeeds at end of stream.
   * Any other code causes the construct to fail.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function maybeEnd(this: void, code: Code): State | undefined {
    if (eos(code)) return ok(code)
    if (eol(code)) return effects.consume(code), maybeEnd
    return nok(code)
  }
}

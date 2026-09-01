/**
 * @file Constructs - eoc
 * @module docmark-grammar/constructs/eoc
 */

import type {
  Code,
  Effects,
  PartialConstruct,
  State,
  TokenizeContext
} from '@flex-development/docmark-util-types'
import { eol, eos, whitespace } from '@flex-development/mark-util-character'

/**
 * The end-of-content construct.
 *
 * End of content consists of zero or more line endings and/or whitespace
 * characters followed by end of stream.
 *
 * This construct is used when a caller must determine whether the remainder of
 * a content stream contains only blank lines and/or whitespace.
 *
 * @const {PartialConstruct} eoc
 */
const eoc: PartialConstruct = { partial: true, tokenize: tokenizeEndOfContent }

export default eoc

/**
 * Tokenize end of content.
 *
 * Line endings and whitespace characters are consumed until the first non-space
 * and non-line-ending code is reached.
 * The construct succeeds if that code is end of stream and fails otherwise.
 *
 * End of stream is not consumed.
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
function tokenizeEndOfContent(
  this: TokenizeContext,
  effects: Effects,
  ok: State,
  nok: State
): State {
  return maybeEnd

  /**
   * Consume line endings and whitespace before a possible end of content.
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
    if (eol(code) || whitespace(code)) return effects.consume(code), maybeEnd
    return nok(code)
  }
}

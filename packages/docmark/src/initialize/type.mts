/**
 * @file Constructs - type
 * @module docmark/initialize/type
 */

import type {
  Code,
  Effects,
  InitialConstruct,
  State,
  TokenizeContext
} from '@flex-development/docmark-util-types'

/**
 * The initial type expression construct.
 *
 * The initializer is expected to run on type expression chunks (`chunkType`).
 *
 * At each position, constructs registered at the `type` content level are
 * attempted in extension order.
 * If no construct succeeds, the current character code is consumed without
 * producing a token and construct dispatch resumes at the next position.
 *
 * By default, the `typeExpressionValue` construct is registered for all
 * character codes. It groups otherwise unrecognized type-expression content
 * into a `typeExpressionValue` token.\
 * Language-specific extensions can register more precise constructs to run
 * before that fallback.
 *
 * @const {InitialConstruct} type
 */
const type: InitialConstruct = { tokenize: tokenizeType }

export default type

/**
 * Tokenize a type expression stream.
 *
 * Constructs registered for the `type` content type are attempted at each
 * position in the stream.
 * When no construct succeeds, the current character code is consumed without
 * producing a token and dispatch resumes at the next position.
 *
 * @this {TokenizeContext}
 *
 * @param {Effects} effects
 *  The context object used to transition the state machine
 * @return {State}
 *  The initial state
 */
function tokenizeType(this: TokenizeContext, effects: Effects): State {
  /**
   * The tokenization context.
   *
   * @const {TokenizeContext} self
   */
  const self: TokenizeContext = this

  return attempt

  /**
   * Attempt type expression constructs.
   *
   * Constructs registered at the `type` content level are attempted in
   * extension order.
   * On success, dispatch resumes at the current stream position.\
   * If all constructs fail, control passes to {@linkcode eat}.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function attempt(this: void, code: Code): State | undefined {
    return effects.attempt(self.parser.constructs.type, attempt, eat)(code)
  }

  /**
   * Consume unmatched type expression content.
   *
   * The current character code did not begin any registered construct.\
   * It is consumed without producing a token before construct dispatch resumes
   * at the next position.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function eat(this: void, code: Code): State | undefined {
    return effects.consume(code), attempt
  }
}

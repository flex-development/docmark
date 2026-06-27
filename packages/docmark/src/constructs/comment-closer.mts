/**
 * @file Constructs - commentCloser
 * @module docmark/constructs/commentCloser
 */

import { factorySpace } from '@flex-development/docmark-factory-space'
import { codes, tt } from '@flex-development/docmark-util-symbol'
import type {
  Code,
  Effects,
  PartialConstruct,
  State,
  TokenizeContext
} from '@flex-development/docmark-util-types'

/**
 * The comment closer construct.
 *
 * Comment closers finish a comment.
 * Closers consist of a single asterisk (`*`) followed by a forward slash (`/`).
 *
 * @const {PartialConstruct} commentCloser
 */
const commentCloser: PartialConstruct = {
  partial: true,
  tokenize: tokenizeCommentCloser
}

export default commentCloser

/**
 * Tokenize a comment closer.
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
function tokenizeCommentCloser(
  this: TokenizeContext,
  effects: Effects,
  ok: State,
  nok: State
): State {
  return factorySpace(effects, commentCloser, tt.commentLinePadding, 2)

  /**
   * At the beginning of a comment closer.
   *
   * > 👉 **Note**: `•` represents an asterisk.
   *
   * @example
   *  ```markdown
   *  > | •/
   *      ^
   *  ```
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function commentCloser(this: void, code: Code): State | undefined {
    if (code !== codes.asterisk) return nok(code)
    return effects.enter(tt.commentCloser), effects.consume(code), afterAsterisk
  }

  /**
   * After comment closer marker.
   *
   * > 👉 **Note**: `•` represents an asterisk.
   *
   * @example
   *  ```markdown
   *  > | •/
   *       ^
   *  ```
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function afterAsterisk(this: void, code: Code): State | undefined {
    if (code !== codes.slash) return nok(code)
    return effects.consume(code), effects.exit(tt.commentCloser), ok
  }
}

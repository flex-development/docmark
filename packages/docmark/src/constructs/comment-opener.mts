/**
 * @file Constructs - commentOpener
 * @module docmark/constructs/commentOpener
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
import { ok as assert } from 'devlop'

/**
 * The comment opener construct.
 *
 * Comment openers start a comment.
 * Docblock comment openers consist of a single forward slash (`/`) followed by
 * two asterisks (`**`). An optional whitespace character can follow the opener
 * to separate it from the comment content.
 *
 * @const {PartialConstruct} commentOpener
 */
const commentOpener: PartialConstruct = {
  partial: true,
  tokenize: tokenizeCommentOpener
}

export default commentOpener

/**
 * Tokenize a comment opener.
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
function tokenizeCommentOpener(
  this: TokenizeContext,
  effects: Effects,
  ok: State,
  nok: State
): State {
  return commentOpener

  /**
   * At the beginning of a comment opener.
   *
   * @example
   *  ```markdown
   *  > | /**
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
  function commentOpener(this: void, code: Code): State | undefined {
    assert(code === codes.slash, 'expected `codes.slash`')
    return effects.enter(tt.commentOpener), effects.consume(code), afterSlash
  }

  /**
   * After a comment opener marker.
   *
   * @example
   *  ```markdown
   *  > | /**
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
  function afterSlash(this: void, code: Code): State | undefined {
    if (code !== codes.asterisk) return nok(code)
    return effects.consume(code), lastAsterisk
  }

  /**
   * At the last asterisk in a comment opener.
   *
   * @example
   *  ```markdown
   *  > | /**
   *        ^
   *  ```
   *
   * @example
   *  ```markdown
   *  > | /** a
   *        ^
   *  ```
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function lastAsterisk(this: void, code: Code): State | undefined {
    if (code !== codes.asterisk) return nok(code)

    effects.consume(code)
    effects.exit(tt.commentOpener)

    return factorySpace(effects, ok, tt.commentLinePadding, 2)
  }
}

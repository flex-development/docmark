/**
 * @file Constructs - commentLinePrefix
 * @module docmark/constructs/commentLinePrefix
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
import { markdownLineEnding } from 'micromark-util-character'
import commentCloser from './comment-closer.mts'

/**
 * The comment line prefix construct.
 *
 * A comment line prefix is a sequence of characters preceded by a line ending.
 * The character sequence is as follows: any number of whitespace characters, a
 * single asterisk (`*`), and an optional whitespace character.
 *
 * @const {PartialConstruct} commentLinePrefix
 */
const commentLinePrefix: PartialConstruct = {
  partial: true,
  previous: markdownLineEnding,
  tokenize: tokenizeCommentLinePrefix
}

export default commentLinePrefix

/**
 * Tokenize a comment line prefix.
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
function tokenizeCommentLinePrefix(
  this: TokenizeContext,
  effects: Effects,
  ok: State,
  nok: State
): State {
  return commentLinePrefix

  /**
   * At the beginning of a comment line.
   *
   * @example
   *  ```markdown
   *  > |   * At the beginning of a comment line.
   *     ^
   *  ```
   *
   * @example
   *  ```markdown
   *  > |   *\/
   *     ^
   *  ```
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function commentLinePrefix(this: void, code: Code): State | undefined {
    effects.enter(tt.commentLinePrefix)

    // capture line padding, then check for comment closer.
    // if no closer, check for marker. otherwise, finish prefix.
    return factorySpace(
      effects,
      effects.check(commentCloser, atChunk, commentLineMarker),
      tt.commentLinePadding
    )(code)
  }

  /**
   * At a comment line marker.
   *
   * @example
   *  ```markdown
   *  > |   * At a comment line marker.
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
  function commentLineMarker(this: void, code: Code): State | undefined {
    if (code === codes.asterisk) {
      effects.enter(tt.commentLineMarker)
      effects.consume(code)
      effects.exit(tt.commentLineMarker)
      return afterMarker
    }

    return nok(code) // actually inside of comment chunk.
  }

  /**
   * After a comment line marker, at optional whitespace.
   *
   * @example
   *  ```markdown
   *  > |   * After comment line marker, at optional whitespace.
   *         ^
   *  ```
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function afterMarker(this: void, code: Code): State | undefined {
    assert(code !== codes.slash, 'expected failure on comment closer')
    return factorySpace(effects, atChunk, tt.commentLinePadding, 2)(code)
  }

  /**
   * At the beginning of a comment chunk.
   *
   * @example
   *  ```markdown
   *  > |   * At the beginning of a comment chunk.
   *          ^
   *  ```
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function atChunk(this: void, code: Code): State | undefined {
    return effects.exit(tt.commentLinePrefix), ok(code)
  }
}

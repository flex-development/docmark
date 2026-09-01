/**
 * @file Constructs - lineComment
 * @module fixtures/constructs/lineComment
 */

import { factorySpace } from '@flex-development/docmark-factory-space'
import {
  codes,
  constants,
  kind,
  tt
} from '@flex-development/docmark-util-symbol'
import type {
  Code,
  ContinuableConstruct,
  Effects,
  NamedConstruct,
  State,
  TokenizeContext
} from '@flex-development/docmark-util-types'
import { eol } from '@flex-development/mark-util-character'
import { ok as assert } from 'devlop'

/**
 * The line comment construct.
 *
 * The construct recognizes a line comment and maintains its container state
 * across lines.
 *
 * This construct is expected to run at the `source` content level.
 *
 * @const {ContinuableConstruct & NamedConstruct} lineComment
 */
const lineComment: ContinuableConstruct & NamedConstruct = {
  continuation: { tokenize: tokenizeLineCommentContinuation },
  exit: exitLineComment,
  name: `${tt.comment}:${kind.line}`,
  tokenize: tokenizeLineComment
}

export default lineComment

/**
 * Exit the comment container.
 *
 * @this {TokenizeContext}
 *
 * @param {Effects} effects
 *  The context object used to transition the state machine
 * @return {undefined}
 */
function exitLineComment(this: TokenizeContext, effects: Effects): undefined {
  return void effects.exit(tt.comment)
}

/**
 * Tokenize the first line of a line comment or a continued line.
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
function tokenizeLineComment(
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

  return startComment

  /**
   * Attempt to begin a line comment,
   * or try continuing a line comment if the container is already open.
   *
   * > 👉 **Note**: `␊` represents a line ending.
   *
   * @example
   *  ```markdown
   *  > |// continuation construct did not consume entire line.␊
   *     ^
   *  > |// start markdown chunk from current point in the stream.␊
   *  > |if (!eol(self.previous)) return beforeMarkdown(code)␊
   *  ```
   *
   * @example
   *  ```markdown
   *  > |// continuation construct did not consume entire line.␊
   *  > |// start markdown chunk from current point in the stream.␊
   *     ^
   *  > |if (!eol(self.previous)) return beforeMarkdown(code)␊
   *  ```
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function startComment(this: void, code: Code): State | undefined {
    // cannot start a line comment.
    if (code !== codes.slash) return nok(code)
    assert(self.containerState, 'expected `containerState` inside comment')

    // open the comment container if not already open.
    if (!self.containerState.open) {
      effects.enter(tt.comment, { _container: true, _kind: kind.line })
      self.containerState.open = true
    }

    // try capturing comment markers.
    return atFirstMarker(code)
  }

  /**
   * After first comment line marker.
   *
   * > 👉 **Note**: `␊` represents a line ending.
   *
   * @example
   *  ```markdown
   *  > |// continuation construct did not consume entire line.␊
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
  function atFirstMarker(this: void, code: Code): State | undefined {
    effects.enter(tt.commentLinePrefix)

    effects.enter(tt.commentLineMarker)
    effects.consume(code)
    effects.exit(tt.commentLineMarker)

    return afterFirstMarker
  }

  /**
   * After last comment line marker.
   *
   * > 👉 **Note**: `␊` represents a line ending.
   *
   * @example
   *  ```markdown
   *  > |// continuation construct did not consume entire line.␊
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
  function afterFirstMarker(this: void, code: Code): State | undefined {
    if (code !== self.previous) return nok(code)

    effects.enter(tt.commentLineMarker)
    effects.consume(code)
    effects.exit(tt.commentLineMarker)

    return factorySpace(
      effects,
      afterMarkers,
      tt.commentPadding,
      constants.commentPaddingSizeMin
    )
  }

  /**
   * After comment line markers and optional padding.
   *
   * > 👉 **Note**: `␊` represents a line ending.
   *
   * @example
   *  ```markdown
   *  > |// continuation construct did not consume entire line.␊
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
  function afterMarkers(this: void, code: Code): State | undefined {
    effects.exit(tt.commentLinePrefix)
    return ok(code)
  }
}

/**
 * Continue tokenizing a line comment.
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
function tokenizeLineCommentContinuation(
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

  return lineStart

  /**
   * Begin a continued comment line.
   *
   * > 👉 **Note**: `␊` represents a line ending.
   *
   * @example
   *  ```markdown
   *  > |// continuation construct did not consume entire line.␊
   *  > |// start comment chunk from current point in the stream.␊
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
  function lineStart(this: void, code: Code): State | undefined {
    assert(eol(self.previous), 'expected to be at beginning of line')
    return factorySpace(effects, afterLineStart, tt.commentPadding)(code)
  }

  /**
   * Try capturing comment markers.
   *
   * > 👉 **Note**: `␊` represents a line ending.
   *
   * @example
   *  ```markdown
   *  > |// continuation construct did not consume entire line.␊
   *  > |// start comment chunk from current point in the stream.␊
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
  function afterLineStart(this: void, code: Code): State | undefined {
    return effects.attempt(lineComment, ok, nok)(code)
  }
}

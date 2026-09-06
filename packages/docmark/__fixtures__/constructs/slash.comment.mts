/**
 * @file Fixtures - slashComment
 * @module docmark/fixtures/constructs/slashComment
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
import { ok as assert } from 'devlop'

/**
 * The slash comment construct.
 *
 * This construct is expected to run at the `source` content level.
 *
 * @const {ContinuableConstruct & NamedConstruct} slashComment
 */
const slashComment: ContinuableConstruct & NamedConstruct = {
  continuation: { tokenize: tokenizeSlashCommentContinuation },
  exit: exitSlashComment,
  name: `${tt.comment}:${kind.slash}`,
  tokenize: tokenizeSlashComment
}

export default slashComment

/**
 * Exit the comment container.
 *
 * @this {TokenizeContext}
 *
 * @param {Effects} effects
 *  The context object used to transition the state machine
 * @return {undefined}
 */
function exitSlashComment(this: TokenizeContext, effects: Effects): undefined {
  return void effects.exit(tt.comment)
}

/**
 * Tokenize the first line of a slash comment or a continued line.
 *
 * The first line opens the comment container before capturing the comment line
 * prefix.\
 * Continued lines reuse this tokenizer through the continuation construct.
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
function tokenizeSlashComment(
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
   * Attempt to begin or continue a slash comment.
   *
   * The comment container is opened when it is not already open.
   * Continued lines reuse this state through the continuation construct.
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
    // cannot start a slash comment.
    if (code !== codes.slash) return nok(code)
    assert(self.containerState, 'expected `containerState` inside comment')

    // open the comment container if not already open.
    if (!self.containerState.open) {
      effects.enter(tt.comment, { _container: true, _kind: kind.slash })
      self.containerState.open = true
    }

    // try capturing comment markers.
    return atFirstMarker(code)
  }

  /**
   * At first comment line marker.
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
    // begin comment line prefix.
    effects.enter(tt.commentLinePrefix)

    // capture first comment line marker.
    effects.enter(tt.commentLineMarker)
    effects.consume(code)
    effects.exit(tt.commentLineMarker)

    return afterFirstMarker
  }

  /**
   * After first comment line marker.
   *
   * > 👉 **Note**: `␊` represents a line ending.
   *
   * @example
   *  ```markdown
   *  > |//cannot be a line comment.␊
   *      ^
   *  > |if (code !== self.previous) return nok(code)
   *  ```
   *
   * @example
   *  ```markdown
   *  > |// continuation construct did not consume entire line.␊
   *  > |// start markdown chunk from current point in the stream.␊
   *      ^
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
  function afterFirstMarker(this: void, code: Code): State | undefined {
    // cannot be a slash comment.
    if (code !== self.previous) return nok(code)

    // capture second comment line marker.
    effects.enter(tt.commentLineMarker)
    effects.consume(code)
    effects.exit(tt.commentLineMarker)

    // capture optional padding.
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
   * The comment line prefix ends immediately before comment content.
   *
   * > 👉 **Note**: `␊` represents a line ending.
   *
   * @example
   *  ```markdown
   *  > |//cannot be a line comment.␊
   *       ^
   *  > |if (code !== self.previous) return nok(code)
   *  ```
   *
   * @example
   *  ```markdown
   *  > |// continuation construct did not consume entire line.␊
   *  > |// start markdown chunk from current point in the stream.␊
   *        ^
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
  function afterMarkers(this: void, code: Code): State | undefined {
    effects.exit(tt.commentLinePrefix)
    return ok(code)
  }
}

/**
 * Continue tokenizing a slash comment.
 *
 * A continuation line may contain optional padding before
 * a comment line prefix.\
 * The comment container remains open while the {@linkcode slashComment}
 * construct is attempted again.
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
function tokenizeSlashCommentContinuation(
  this: TokenizeContext,
  effects: Effects,
  ok: State,
  nok: State
): State {
  return lineStart

  /**
   * Begin a continued comment line.
   *
   * > 👉 **Note**: `␊` represents a line ending.
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
  function lineStart(this: void, code: Code): State | undefined {
    return factorySpace(effects, afterLineStart, tt.commentPadding)(code)
  }

  /**
   * Attempt to tokenize comment line markers.
   *
   * The {@linkcode lineComment} construct is attempted from the current point
   * after optional padding.
   *
   * > 👉 **Note**: `␊` represents a line ending.
   *
   * @example
   *  ```markdown
   *  > |   // continuation construct did not consume entire line.␊
   *  > |   // start comment chunk from current point in the stream.␊
   *        ^
   *  > |   if (!eol(self.previous)) return beforeMarkdown(code)␊
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
    return effects.attempt(slashComment, ok, nok)(code)
  }
}

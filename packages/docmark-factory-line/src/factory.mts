/**
 * @file factoryLineComment
 * @module docmark-factory-line/factory
 */

import type { Markers, Options } from '@flex-development/docmark-factory-line'
import { factoryMarkers } from '@flex-development/docmark-factory-markers'
import { factorySpace } from '@flex-development/docmark-factory-space'
import { constants, kind, tt } from '@flex-development/docmark-util-symbol'
import type {
  Code,
  ContinuableConstruct,
  Effects,
  State,
  TokenFields,
  TokenizeContext
} from '@flex-development/docmark-util-types'
import { ok as assert } from 'devlop'

export default factoryLineComment

/**
 * Create a construct that tokenizes line comments.
 *
 * @see {@linkcode ContinuableConstruct}
 * @see {@linkcode Options}
 *
 * @template {ContinuableConstruct} T
 *  The line comment construct
 *
 * @this {void}
 *
 * @param {NamedOptions | Options} options
 *  The options for creating the construct
 * @return {T}
 *  The line comment construct
 */
function factoryLineComment<T extends ContinuableConstruct>(
  this: void,
  options: Options
): T {
  /**
   * The line comment construct.
   *
   * @const {ContinuableConstruct} lineComment
   */
  const lineComment: ContinuableConstruct = {
    ...options.construct,
    continuation: { tokenize: tokenizeLineCommentContinuation },
    exit: exitLineComment,
    tokenize: tokenizeLineComment
  }

  options.finalizeConstruct?.(lineComment)
  return lineComment as T

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
    void options.construct?.exit?.call(this, effects)
    return void effects.exit(tt.comment)
  }

  /**
   * Tokenize the first line of a line comment or a continued line.
   *
   * The first line opens the comment container before capturing the comment
   * line prefix.\
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

    /**
     * The token fields.
     *
     * @const {TokenFields | null | undefined} fields
     */
    const fields: TokenFields | null | undefined =
      typeof options.fields === 'function'
        ? options.fields.call(self)
        : options.fields

    /**
     * The markers configuration.
     *
     * @const {Markers} markers
     */
    const markers: Markers = typeof options.markers === 'function'
      ? options.markers.call(self)
      : options.markers

    return startComment

    /**
     * Attempt to begin or continue a line comment.
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
      assert(self.containerState, 'expected `containerState` inside comment')

      // open the comment container if not already open.
      if (!self.containerState.open) {
        // start new comment.
        effects.enter(tt.comment, { kind: kind.line, ...fields })

        // the comment container is fresh.
        // markers are captured inside a `commentOpener` token.
        effects.enter(tt.commentOpener)

        // try capturing comment markers.
        return factoryMarkers(effects, endOpener, nok, markers)(code)
      }

      // the comment container is open.
      // markers are captured inside a `commentLinePrefix` token.

      // begin comment line prefix.
      effects.enter(tt.commentLinePrefix)

      /**
       * Capture optional comment padding.
       *
       * @const {State} paddingAfter
       */
      const paddingAfter: State = factorySpace(
        effects,
        endPrefix,
        tt.commentPadding,
        constants.commentPaddingSizeMin
      )

      // try capturing comment markers.
      return factoryMarkers(effects, paddingAfter, nok, markers)(code)
    }

    /**
     * After the opening set of comment line markers.
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
     *      ^
     *  > |// start markdown chunk from current point in the stream.␊
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
    function endOpener(this: void, code: Code): State | undefined {
      assert(self.containerState, 'expected `containerState` inside comment')

      // finish the comment opener and propagate token to container state.
      self.containerState.opener = effects.exit(tt.commentOpener)

      // mark the comment container as open.
      self.containerState.open = true

      // capture optional padding following the opener.
      // **note**: padding is captured ***outside*** the opener,
      // as opposed to inside like with `commentLinePrefix`es.
      return factorySpace(
        effects,
        ok,
        tt.commentPadding,
        constants.commentPaddingSizeMin
      )(code)
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
    function endPrefix(this: void, code: Code): State | undefined {
      effects.exit(tt.commentLinePrefix)
      return ok(code)
    }
  }

  /**
   * Continue tokenizing a line comment.
   *
   * A continuation line may contain optional padding before
   * a comment line prefix.\
   * The comment container remains open while the {@linkcode lineComment}
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
     *  > |   // continuation construct did not consume entire line.␊
     *  > |   // start markdown chunk from current point in the stream.␊
     *     ^
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
    function lineStart(this: void, code: Code): State | undefined {
      assert(self.containerState, 'expected `containerState` inside comment')
      assert(self.containerState.opener, 'expected comment `opener` token')
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
      return effects.attempt(lineComment, ok, nok)(code)
    }
  }
}

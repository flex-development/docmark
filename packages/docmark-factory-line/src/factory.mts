/**
 * @file factoryLineComment
 * @module docmark-factory-line/factory
 */

import type {
  NamedOptions,
  Options
} from '@flex-development/docmark-factory-line'
import { factoryMarkers } from '@flex-development/docmark-factory-markers'
import { factorySpace } from '@flex-development/docmark-factory-space'
import { constants, kind, tt } from '@flex-development/docmark-util-symbol'
import type {
  Code,
  ContinuableConstruct,
  Effects,
  NamedConstruct,
  State,
  TokenizeContext
} from '@flex-development/docmark-util-types'
import { ok as assert } from 'devlop'

export default factoryLineComment

/**
 * Create a construct that tokenizes line comments.
 *
 * @see {@linkcode ContinuableConstruct}
 * @see {@linkcode NamedOptions}
 *
 * @template {ContinuableConstruct & NamedConstruct} T
 *  The line comment construct
 *
 * @this {void}
 *
 * @param {NamedOptions} options
 *  The options for creating the named construct
 * @return {T}
 *  The line comment construct
 */
function factoryLineComment<T extends ContinuableConstruct & NamedConstruct>(
  this: void,
  options: NamedOptions
): T

/**
 * Create a construct that tokenizes line comments.
 *
 * @see {@linkcode ContinuableConstruct}
 * @see {@linkcode NamedOptions}
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
  options: NamedOptions | Options
): T

/**
 * Create a construct that tokenizes line comments.
 *
 * @see {@linkcode ContinuableConstruct}
 * @see {@linkcode NamedOptions}
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
  options: NamedOptions | Options
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
        effects.enter(tt.comment, { kind: kind.line, ...options.fields })
        self.containerState.open = true
      }

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
      return factoryMarkers(effects, paddingAfter, nok, options.markers)(code)
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

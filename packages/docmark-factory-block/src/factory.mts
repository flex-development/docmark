/**
 * @file factoryBlockComment
 * @module docmark-factory-block/factory
 */

import type { Markers, Options } from '@flex-development/docmark-factory-block'
import {
  factoryMarkers,
  type Info,
  type Sequence
} from '@flex-development/docmark-factory-markers'
import { normalize } from '@flex-development/docmark-factory-markers/utils'
import { factorySpace } from '@flex-development/docmark-factory-space'
import {
  blankLine,
  trailingWhitespace
} from '@flex-development/docmark-grammar'
import { constants, kind, tt } from '@flex-development/docmark-util-symbol'
import type {
  Code,
  ContinuableConstruct,
  Effects,
  Marker,
  PartialConstruct,
  Place,
  Position,
  State,
  TokenFields,
  TokenizeContext
} from '@flex-development/docmark-util-types'
import { eol, eos, whitespace } from '@flex-development/mark-util-character'
import { ok as assert } from 'devlop'
import finalMarker from './internal/final-marker.mts'
import firstMarker from './internal/first-marker.mts'

export default factoryBlockComment

/**
 * Create a construct that tokenizes block comments.
 *
 * @see {@linkcode ContinuableConstruct}
 * @see {@linkcode Options}
 *
 * @template {ContinuableConstruct} T
 *  The block comment construct
 *
 * @this {void}
 *
 * @param {Options} options
 *  The options for creating the construct
 * @return {T}
 *  The block comment construct
 */
function factoryBlockComment<T extends ContinuableConstruct>(
  this: void,
  options: Options
): T {
  /**
   * The block comment construct.
   *
   * @const {ContinuableConstruct} blockComment
   */
  const blockComment: ContinuableConstruct = {
    ...options.construct,
    continuation: { tokenize: tokenizeBlockCommentContinuation },
    exit: exitBlockComment,
    tokenize: tokenizeBlockComment
  }

  /**
   * The comment opener construct.
   *
   * A comment opener begins a block comment.
   *
   * Whitespace following the marker may be recognized separately as comment
   * padding or, when it reaches the end of the line, as trailing whitespace.
   *
   * @const {PartialConstruct} commentOpener
   */
  const commentOpener: PartialConstruct = {
    partial: true,
    tokenize: tokenizeCommentOpener
  }

  /**
   * The comment line prefix construct.
   *
   * A comment line prefix occurs at the beginning of a line within a comment.
   * It may contain leading comment line padding, a single comment line marker,
   * and optional padding following the marker.
   *
   * A prefix may also consist only of padding when the next input begins the
   * comment closer.
   *
   * @const {PartialConstruct} commentLinePrefix
   */
  const commentLinePrefix: PartialConstruct = {
    partial: true,
    previous: eol,
    tokenize: tokenizeCommentLinePrefix
  }

  /**
   * The alternate comment line prefix construct.
   *
   * An alternate comment line prefix contains only padding.\
   * Unlike the {@linkcode commentLinePrefix} construct, such padding is
   * calculated based on the current comment opener's `end` column.
   *
   * @const {PartialConstruct} commentLinePrefixAlt
   */
  const commentLinePrefixAlt: PartialConstruct = {
    partial: true,
    previous: eol,
    tokenize: tokenizeCommentLinePrefixAlt
  }

  /**
   * The comment closer construct.
   *
   * A comment closer ends a block comment.
   *
   * One whitespace character preceding the closer may be recognized separately
   * as comment padding.
   *
   * @const {PartialConstruct} commentCloser
   */
  const commentCloser: PartialConstruct = {
    partial: true,
    tokenize: tokenizeCommentCloser
  }

  /**
   * The trailing comment closer construct.
   *
   * A trailing comment closer consists of whitespace followed by a comment
   * closer.
   *
   * @const {PartialConstruct} trailingCommentCloser
   */
  const trailingCommentCloser: PartialConstruct = {
    partial: true,
    tokenize: tokenizeTrailingCommentCloser
  }

  /**
   * Record where each key is a marker type and each value is an info object
   * representing the first marker in a registered marker sequence.
   *
   * @var {Record<keyof Omit<Markers, 'line'>, Info>} fm
   */
  let fm: Record<keyof Omit<Markers, 'line'>, Info>

  /**
   * The markers configuration.
   *
   * @var {Markers} markers
   */
  let markers: Markers

  options.finalizeConstruct?.(blockComment)
  return blockComment as T

  /**
   * Exit the comment container.
   *
   * @this {TokenizeContext}
   *
   * @param {Effects} effects
   *  The context object used to transition the state machine
   * @return {undefined}
   */
  function exitBlockComment(
    this: TokenizeContext,
    effects: Effects
  ): undefined {
    void options.construct?.exit?.call(this, effects)
    return void effects.exit(tt.comment)
  }

  /**
   * Tokenize the first line of a block comment.
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
  function tokenizeBlockComment(
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

    // initializer markers configuration and first markers map.
    if (typeof markers === 'undefined') {
      markers = typeof options.markers === 'function'
        ? options.markers.call(self)
        : options.markers

      fm = {
        closer: firstMarker(markers.closer),
        opener: firstMarker(markers.opener)
      }
    }

    return startComment

    /**
     * Attempt to begin a block comment.
     *
     * The comment container is entered before the opener is attempted.
     * If the opener fails, the construct fails.
     * This is the only failure point.
     *
     * @example
     *  ```markdown
     *  > |/**
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
    function startComment(this: void, code: Code): State | undefined {
      assert(code === fm.opener.code, `expected \`${fm.opener.code}\``)
      effects.enter(tt.comment, { kind: kind.block, ...fields })
      return effects.attempt(commentOpener, afterOpener, nok)(code)
    }

    /**
     * Continue after a comment opener.
     *
     * The comment may end immediately, continue onto the next line, or begin a
     * comment chunk on the current line.
     *
     * A possible closer is attempted before ordinary comment content so empty
     * comments can terminate without producing a chunk.
     *
     * > 👉 **Note**: `␊` represents a line ending, `␠` represents a space,
     * > and `ᴺᵁᴸ` represents end-of-stream.
     *
     * @example
     *  ```markdown
     *  > |/**ᴺᵁᴸ
     *        ^
     *  ```
     *
     * @example
     *  ```markdown
     *  > |/**␠␠␠␊
     *  > | * @file factoryBlockComment
     *     ^
     *  ```
     *
     * @example
     *  ```markdown
     *  > |/**␊
     *        ^
     *  ```
     *
     * @example
     *  ```markdown
     *  > |/**␠␠*\/
     *         ^
     *  ```
     *
     * @example
     *  ```markdown
     *  > |/**␠␠␠␠␠␠␠␠␠␠␠␠␠␠␠*\/
     *         ^
     *  ```
     *
     * @example
     *  ```markdown
     *  > |/**␠␠@type {State}␠␠*\/
     *         ^
     *  ```
     *
     * @example
     *  ```markdown
     *  > |/***\/
     *        ^
     *  ```
     *
     * @example
     *  ```markdown
     *  > |/****note**: starts at `0` to skip the first event.*\/
     *        ^
     *  ```
     *
     * @example
     *  ```markdown
     *  > |/**Handle events coming from `tokenize`*\/
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
    function afterOpener(this: void, code: Code): State | undefined {
      // comment terminated by end of stream.
      if (eos(code)) return ok(code)

      // the `commentOpener` construct captured trailing whitespace.
      // the entirety of the first line has been consumed.
      // `tokenizeBlockCommentContinuation` will take over from here.
      if (eol(self.previous)) return ok(code)

      // capture line ending.
      // the comment container is still open.
      // `tokenizeBlockCommentContinuation` will take over from here.
      // if line ending is handled by markdown tokenizers, it will be considered
      // a blank line even though the comment opener is on this line.
      if (eol(code)) {
        effects.enter(tt.lineEnding)
        effects.consume(code)
        effects.exit(tt.lineEnding)
        return ok
      }

      // check for comment closer sequence before starting chunk.
      // on failure, capture any whitespace so its not considered a line prefix.
      if (whitespace(code)) {
        return effects.attempt(
          commentCloser,
          closeComment,
          // try finishing a whitespace-only comment.
          // on success, mark comment container for closer.
          // otherwise, capture arbitrary whitespace before starting chunk.
          effects.attempt(
            trailingCommentCloser,
            closeComment,
            effects.check(
              trailingWhitespace,
              ok,
              factorySpace(effects, startChunk, tt.whitespace)
            )
          )
        )(code)
      }

      // check for comment closer before starting first chunk.
      // if closer cannot start, the chunk starts on the same line as opener.
      return effects.attempt(commentCloser, closeComment, startChunk)(code)
    }

    /**
     * Start the first comment chunk.
     *
     * The first chunk begins on the same line as the comment opener.
     *
     * @this {void}
     *
     * @param {Code} code
     *  The current character code
     * @return {State | undefined}
     *  The next state
     */
    function startChunk(this: void, code: Code): State | undefined {
      assert(!eos(code), 'did not expect end of stream')

      // start new comment chunk on same line as opener.
      effects.enter(tt.chunkComment, {
        contentType: constants.contentTypeComment
      })

      return insideChunk(code)
    }

    /**
     * Continue the first comment chunk.
     *
     * Content is consumed through the end of the current line.
     * A possible closer is checked before {@linkcode fm.closer} or a whitespace
     * is committed to the chunk.
     *
     * At a line ending, the chunk is closed.
     * Later lines are handled by {@linkcode tokenizeBlockCommentContinuation}.
     *
     * > 👉 **Note**: `␊` represents a line ending
     * > and `ᴺᵁᴸ` represents end-of-stream.
     *
     * @example
     *  ```markdown
     *  > |/** @experimentalᴺᵁᴸ
     *         ^^^^^^^^^^^^^
     *  ```
     *
     * @example
     *  ```markdown
     *  > |/** Tokenize an identifier.␊
     *         ^^^^^^^^^^^^^^^^^^^^^^^
     *  ```
     *
     * @example
     *  ```markdown
     *  > |/** One place in a source *file* *\/
     *         ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
     *  ```
     *
     * @example
     *  ```markdown
     *  > |/**Handle events coming from `tokenize`*\/
     *        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
     *  ```
     *
     * @this {void}
     *
     * @param {Code} code
     *  The current character code
     * @return {State | undefined}
     *  The next state
     */
    function insideChunk(this: void, code: Code): State | undefined {
      // comment terminated by end of stream.
      if (eos(code)) {
        effects.exit(tt.chunkComment)
        return ok(code)
      }

      // finish comment chunk after first line ending.
      // the comment container is still open.
      // `tokenizeBlockCommentContinuation` will take over from here.
      if (eol(code)) {
        effects.consume(code)
        effects.exit(tt.chunkComment)
        return ok
      }

      // try capturing comment closer before adding to chunk.
      // otherwise, consume code and move onto the next.
      return effects.check(commentCloser, beforeCloser, addToChunk)(code)
    }

    /**
     * Finish the first chunk before a comment closer.
     *
     * The closer was already confirmed with `effects.check`, so the chunk can
     * be closed before the closer is consumed.
     *
     * @example
     *  ```markdown
     *  > |/** One place in a source *file* *\/
     *                                     ^
     *  ```
     *
     * @example
     *  ```markdown
     *  > |/**Handle events coming from `tokenize`*\/
     *                                            ^
     *  ```
     *
     * @this {void}
     *
     * @param {Code} code
     *  The current character code
     * @return {State | undefined}
     *  The next state
     */
    function beforeCloser(this: void, code: Code): State | undefined {
      effects.exit(tt.chunkComment)
      return effects.attempt(commentCloser, closeComment)(code)
    }

    /**
     * Add the current character code to the first comment chunk.
     *
     * This state is reached after checking for an inline comment closer,
     * or after ordinary content is seen inside a comment chunk.
     *
     * @this {void}
     *
     * @param {Code} code
     *  The current character code
     * @return {State | undefined}
     *  The next state
     */
    function addToChunk(this: void, code: Code): State | undefined {
      return effects.consume(code), insideChunk
    }

    /**
     * Mark the active comment for closure.
     *
     * The `source` initializer owns container finalization.
     * This state records that the comment has reached its closing boundary via
     * {@linkcode self.containerState} without exiting the container directly.
     *
     * @this {void}
     *
     * @param {Code} code
     *  The current character code
     * @return {State | undefined}
     *  The next state
     */
    function closeComment(this: void, code: Code): State | undefined {
      assert(self.containerState, 'expected `containerState` inside comment')
      self.containerState._closeFlow = true
      return ok(code)
    }
  }

  /**
   * Continue tokenizing an open block comment.
   *
   * A continuation begins at the start of a line.
   * Comment line prefixes and line indentation are processed before another
   * comment chunk is started.
   *
   * The continuation can also recognize the comment closer and may mark the
   * active container for closure.
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
  function tokenizeBlockCommentContinuation(
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
     * The point where an active markdown indent starts.
     *
     * @var {Place | undefined} then
     */
    let then: Place | undefined

    return lineStart

    /**
     * Begin a continued comment line.
     *
     * A comment line prefix is attempted first.
     * When the marker required by the prefix is not present, line indentation
     * is attempted directly.
     *
     * Both paths leave control at the beginning of normalized comment content.
     *
     * > 👉 **Note**: `␊` represents a line ending
     * > and `ᴺᵁᴸ` represents end-of-stream.
     *
     * @example
     *  ```markdown
     *  > |/**␊
     *  > |ᴺᵁᴸ
     *     ^
     *  ```
     *
     * @example
     *  ```markdown
     *  > |/**␊
     *  > | * The tokenization context.␊
     *     ^
     *  > | *␊
     *  > | * @const {TokenizeContext} self␊
     *  > | *\/
     *  ```
     *
     * @example
     *  ```markdown
     *  > |/**␊
     *  > |   The point where an active markdown indent starts.␊
     *     ^
     *  > |␊
     *  > |   @var {Place | undefined} then␊
     *  > | *\/
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

      // comment terminated by end of stream.
      if (eos(code)) return nok(code)

      // try capturing comment line prefix.
      // the construct fails if a comment line marker is missing,
      // but can succeed without a marker before a comment closer as well.
      // the comment container is marked for closure by `commentLinePrefix`
      // if a comment closer is detected.
      // on success, check for a blank line.
      // if the initial attempt fails, try capturing a padding-only prefix.
      // padding is calculated based on the `end` column of the current opener.
      return effects.attempt(
        commentLinePrefix,
        checkBlankLine,
        // try capturing padding-only prefix.
        // afterwards, on success or failure, check for a blank line.
        // if found, delegate to the `source` initializer.
        effects.attempt(commentLinePrefixAlt, checkBlankLine, checkBlankLine)
      )(code)
    }

    /**
     * Check for a blank line.
     *
     * Blank lines are delegated to the `source` initializer.
     *
     * > 👉 **Note**: `␊` represents a line ending.
     *
     * @example
     *  ```markdown
     *  > |/**␊
     *  > | * The tokenization context.␊
     *  > | *␊
     *       ^
     *  > | * @const {TokenizeContext} self␊
     *  > | *\/
     *  ```
     *
     * @example
     *  ```markdown
     *  > |/**␊
     *  > |   The point where an active markdown indent starts.␊
     *  > |␊
     *     ^
     *  > |   @var {Place | undefined} then␊
     *  > | *\/
     *  ```
     *
     * @this {void}
     *
     * @param {Code} code
     *  The current character code
     * @return {State | undefined}
     *  The next state
     */
    function checkBlankLine(this: void, code: Code): State | undefined {
      // check for a blank line.
      // if found, delegate to the `source` initializer.
      // otherwise try starting comment content chunk.
      return effects.check(blankLine, ok, beforeChunk)(code)
    }

    /**
     * Prepare to start a continued comment chunk.
     *
     * Blank lines have already been delegated to the `source` initializer.
     *
     * If the current `comment` tokenizer encountered concrete content on the
     * previous line, control returns to the `source` initializer.
     *
     * Otherwise, a possible closer is attempted before the chunk begins.
     *
     * > 👉 **Note**: `␊` represents a line ending.
     *
     * @example
     *  ```markdown
     *  > |/**␊
     *  > | * The tokenization context.␊
     *  > | *␊
     *  > | * @const {TokenizeContext} self␊
     *  > | *\/
     *      ^
     *  ```
     *
     * @example
     *  ```markdown
     *  > |/**␊
     *  > | * The tokenization context.␊
     *        ^
     *  > | *␊
     *  > | * @const {TokenizeContext} self␊
     *  > | *\/
     *  ```
     *
     * @example
     *  ```markdown
     *  > |/**␊
     *  > |   The point where an active markdown indent starts.␊
     *        ^
     *  > |␊
     *  > |   @var {Place | undefined} then␊
     *  > | *\/
     *  ```
     *
     * @this {void}
     *
     * @param {Code} code
     *  The current character code
     * @return {State | undefined}
     *  The next state
     */
    function beforeChunk(this: void, code: Code): State | undefined {
      assert(self.containerState, 'expected `containerState` inside comment')

      // the comment container was marked for closure.
      // a comment closer was captured by the `commentLinePrefix` construct.
      // the `source` initializer will handle exiting the comment.
      if (self.containerState._closeFlow) return ok(code)

      // concrete subcontent encountered on previous line.
      // bypass chunk creation and implicit comment closer check.
      if (self.concrete) return ok(code)

      // blank lines are expected to be delegated to the `source` initializer.
      assert(!eol(code), 'did not expect line ending')
      assert(!eos(code), 'did not expect end of stream')

      // previous active markdown indent, fresh region, or previous blank line.
      if (
        self.containerState.markdownIndent ||
        self.parser.previousBlankLine ||
        self.parser.freshRegion ||
        self.parser.freshComment
      ) {
        // possible indented code start.
        // capture current place in the content.
        if (whitespace(code)) then = self.now()
      }

      // check for a comment closer.
      // if found, mark the comment container for closure.
      // otherwise, start comment content chunk.
      return effects.attempt(commentCloser, closeComment, startChunk)(code)
    }

    /**
     * Start a continued comment chunk.
     *
     * The chunk therefore begins at normalized comment content.\
     * Comment line prefixes have already been consumed and blank lines have
     * already been delegated to the `source` initializer.
     *
     * @this {void}
     *
     * @param {Code} code
     *  The current character code
     * @return {State | undefined}
     *  The next state
     */
    function startChunk(this: void, code: Code): State | undefined {
      assert(!self.concrete, 'did not expect concrete subcontent')
      assert(!eol(code), 'did not expect line ending')
      assert(!eos(code), 'did not expect end of stream')

      // start new comment content chunk.
      // the `source` initializer will handle linking and writing chunks.
      effects.enter(tt.chunkComment, {
        contentType: constants.contentTypeComment
      })

      return insideChunk(code)
    }

    /**
     * Continue a comment chunk on a continued line.
     *
     * Content is consumed through the end of the line.\
     * A possible closer is checked before adding to the chunk.
     *
     * The completed chunk includes its line ending when one is present.
     *
     * @this {void}
     *
     * @param {Code} code
     *  The current character code
     * @return {State | undefined}
     *  The next state
     */
    function insideChunk(this: void, code: Code): State | undefined {
      // comment terminated by end of stream.
      // the `source` initializer will handle exiting the comment.
      if (eos(code)) {
        effects.exit(tt.chunkComment)
        return ok(code)
      }

      // finish chunk after line ending.
      // the `source` initializer will handle continuing the comment.
      if (eol(code)) {
        effects.consume(code)
        effects.exit(tt.chunkComment)
        return ok
      }

      // check for indented code prefix.
      // let `source` initializer take over if indented code is detected.
      if (then && whitespace(self.previous) && !whitespace(code)) {
        /**
         * The points to start and stop slicing the stream.
         *
         * @const {Position} range
         */
        const range: Position = { end: self.now(), start: then }

        // line prefix is actually part of indented code.
        // signal markdown indentation to allow continued indented code checks
        // for the next line and delegate comment content chunk creation to the
        // `source` initializer to bypass any remaining comment closer checks.
        if (self.sliceSerialize(range, true).length >= constants.tabSize) {
          assert(
            self.containerState,
            'expected `containerState` inside comment'
          )

          // signal markdown indentation.
          self.containerState.markdownIndent = true

          // end of line prefix.
          // finish comment content chunk.
          effects.exit(tt.chunkComment)

          // delegate chunk creation to the `source` initializer.
          // the initializer will create a separate chunk for the rest of the
          // line and link it to the chunk that was just closed.
          // the next continuation attempt will start at beginning
          // of the next line instead of the current position.
          return ok(code)
        }

        // no indented code prefix.

        // discard the whitespace start point.
        then = undefined
      }

      // check for comment closer sequence adding to chunk.
      return effects.check(commentCloser, beforeInlineCloser, addToChunk)(code)
    }

    /**
     * Add the current character code to a continued comment chunk.
     *
     * This state is reached after ordinary content or a failed closer check.
     *
     * @this {void}
     *
     * @param {Code} code
     *  The current character code
     * @return {State | undefined}
     *  The next state
     */
    function addToChunk(this: void, code: Code): State | undefined {
      return effects.consume(code), insideChunk
    }

    /**
     * Finish a continued chunk before a confirmed comment closer.
     *
     * The chunk is closed before the closer is consumed.
     *
     * @this {void}
     *
     * @param {Code} code
     *  The current character code
     * @return {State | undefined}
     *  The next state
     */
    function beforeInlineCloser(this: void, code: Code): State | undefined {
      effects.exit(tt.chunkComment)
      return effects.attempt(commentCloser, closeComment)(code)
    }

    /**
     * Mark the continued comment for closure.
     *
     * Container finalization is deferred to the `source` initializer.
     *
     * @this {void}
     *
     * @param {Code} code
     *  The current character code
     * @return {State | undefined}
     *  The next state
     */
    function closeComment(this: void, code: Code): State | undefined {
      assert(self.containerState, 'expected `containerState` inside comment')
      self.containerState._closeFlow = true
      return ok(code)
    }
  }

  /**
   * Tokenize a comment opener.
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
  function tokenizeCommentOpener(
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
     * The info representing the last marker in the configured marker sequence.
     *
     * @var {Info} lastMarker
     */
    let lastMarker: Info = finalMarker(markers.opener)

    return startOpener

    /**
     * Begin a comment opener.
     *
     * @example
     *  ```markdown
     *  > |/**
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
    function startOpener(this: void, code: Code): State | undefined {
      /**
       * The next state.
       *
       * @var {State} next
       */
      let next: State = afterMarkers

      /**
       * The opening marker sequence.
       *
       * @var {Info | Marker | Sequence} sequence
       */
      let sequence: Info | Marker | Sequence = markers.opener

      // the comment closer is able to overlap the opener.
      if (
        Array.isArray(markers.opener) &&
        markers.opener.length > 1 &&
        typeof lastMarker === 'object' &&
        lastMarker.code === fm.closer.code &&
        lastMarker.optional &&
        !fm.closer.optional
      ) {
        // remove the optional marker from the current sequence.
        sequence = markers.opener.slice(0, -1) as Sequence
        next = maybeMarker

        // ensure no other markers are considered optional.
        for (const [i, marker] of sequence.map(normalize).entries()) {
          sequence[i] = { ...marker, optional: false }
        }
      }

      // start the comment opener and try capturing configured markers.
      effects.enter(tt.commentOpener)
      return factoryMarkers(effects, next, nok, sequence)(code)
    }

    /**
     * Check for overlap between the last comment marker and a comment closer.
     *
     * The comment closer is considered to be overlapping when the last marker
     * code in {@linkcode markers.opener} is optional and equal to the first
     * configured marker code in {@linkcode markers.closer}.
     *
     * @example
     *  ```markdown
     *  > |/**\/
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
    function maybeMarker(this: void, code: Code): State | undefined {
      // cannot start an overlapping comment closer.
      // finish the comment opener normally.
      if (code !== fm.closer.code) return afterMarkers(code)

      // check for an overlapping comment closer.
      // if found, finish the opener without consuming the optional marker.
      // otherwise capture the optional comment marker.
      return effects.check(
        commentCloser,
        beforeCloserOverlap,
        factoryMarkers(effects, afterMarkers, nok, lastMarker)
      )(code)
    }

    /**
     * Before a confirmed overlapping comment closer.
     *
     * @example
     *  ```markdown
     *  > |/**\/
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
    function beforeCloserOverlap(this: void, code: Code): State | undefined {
      assert(self.containerState, 'expected `containerState` inside comment')
      self.containerState.opener = effects.exit(tt.commentOpener)
      return ok(code)
    }

    /**
     * Finish a comment opener.
     *
     * Whitespace following the marker is then consumed as comment padding
     * or arbitrary whitespace.\
     * Whitespace is considered arbitrary when the comment closer follows a
     * single whitespace character after the opener.
     *
     * > 👉 **Note**: `␊` represents a line ending, `␠` represents a space,
     * > and `ᴺᵁᴸ` represents end-of-stream.
     *
     * @example
     *  ```markdown
     *  > |/**␊
     *        ^
     *  ```
     *
     * @example
     *  ```markdown
     *  > |/**ᴺᵁᴸ
     *        ^
     *  ```
     *
     * @example
     *  ```markdown
     *  > |/**␠␠␊
     *        ^
     *  ```
     *
     * @example
     *  ```markdown
     *  > |/**␠*\/
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
      assert(self.containerState, 'expected `containerState` inside comment')

      // finish the comment opener.
      self.containerState.opener = effects.exit(tt.commentOpener)

      // try capturing trailing whitespace.
      // if attempt fails, check for comment closer sequence.
      return effects.attempt(
        trailingWhitespace,
        ok,
        // check for comment closer sequence.
        // on success, capture the leading whitespace as `whitespace` instead
        // of capturing as `commentPadding`.
        // this will force the next `commentCloser` attempt or check to only
        // succeed when an actual closer is seen.
        // on failure, the first whitespace character is seen as padding.
        effects.check(
          commentCloser,
          factorySpace(
            effects,
            ok,
            tt.whitespace,
            constants.commentPaddingSizeMin
          ),
          factorySpace(
            effects,
            ok,
            tt.commentPadding,
            constants.commentPaddingSizeMin
          )
        )
      )(code)
    }
  }

  /**
   * Tokenize a comment closer.
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
  function tokenizeCommentCloser(
    this: TokenizeContext,
    effects: Effects,
    ok: State,
    nok: State
  ): State {
    return factorySpace(
      effects,
      startCloser,
      tt.commentPadding,
      constants.commentPaddingSizeMin
    )

    /**
     * Attempt to begin a comment closer.
     *
     * @this {void}
     *
     * @param {Code} code
     *  The current character code
     * @return {State | undefined}
     *  The next state
     */
    function startCloser(this: void, code: Code): State | undefined {
      effects.enter(tt.commentCloser)
      return factoryMarkers(effects, after, nok, markers.closer)(code)
    }

    /**
     * Finish a comment closer.
     *
     * Control returns to the parent tokenizer.
     *
     * @this {void}
     *
     * @param {Code} code
     *  The current character code
     * @return {State | undefined}
     *  The next state
     */
    function after(this: void, code: Code): State | undefined {
      effects.exit(tt.commentCloser)
      return ok(code)
    }
  }

  /**
   * Tokenize a trailing comment closer.
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
  function tokenizeTrailingCommentCloser(
    this: TokenizeContext,
    effects: Effects,
    ok: State,
    nok: State
  ): State {
    return startTrail

    /**
     * Start the whitespace trail.
     *
     * Whitespace is captured separately so it's not considered comment padding.
     *
     * @this {void}
     *
     * @param {Code} code
     *  The current character code
     * @return {State | undefined}
     *  The next state
     */
    function startTrail(this: void, code: Code): State | undefined {
      assert(whitespace(code), 'expected whitespace code')
      return effects.enter(tt.whitespace), effects.consume(code), insideTrail
    }

    /**
     * Inside the whitespace trail.
     *
     * If no comment closer is present, additional whitespace is consumed.
     *
     * @this {void}
     *
     * @param {Code} code
     *  The current character code
     * @return {State | undefined}
     *  The next state
     */
    function insideTrail(this: void, code: Code): State | undefined {
      return effects.check(commentCloser, closeTrail, addToTrail)(code)
    }

    /**
     * Finish the whitespace trail before a confirmed comment closer.
     *
     * The `whitespace` token is closed before the comment closer is captured.
     *
     * @this {void}
     *
     * @param {Code} code
     *  The current character code
     * @return {State | undefined}
     *  The next state
     */
    function closeTrail(this: void, code: Code): State | undefined {
      effects.exit(tt.whitespace)
      return effects.attempt(commentCloser, ok)(code)
    }

    /**
     * Continue the whitespace trail.
     *
     * Tokenization fails when the current character is not whitespace.
     *
     * @this {void}
     *
     * @param {Code} code
     *  The current character code
     * @return {State | undefined}
     *  The next state
     */
    function addToTrail(this: void, code: Code): State | undefined {
      if (!whitespace(code)) return nok(code)
      return effects.consume(code), insideTrail
    }
  }

  /**
   * Tokenize a comment line prefix.
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
  function tokenizeCommentLinePrefix(
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

    return prefixBefore

    /**
     * Try to begin a comment line prefix.
     *
     * @this {void}
     *
     * @param {Code} code
     *  The current character code
     * @return {State | undefined}
     *  The next state
     */
    function prefixBefore(this: void, code: Code): State | undefined {
      assert(eol(self.previous), 'expected to be at beginning of line')

      // try starting the comment line prefix.
      // the current `code` cannot begin a comment closer.
      if (code !== fm.closer.code) return prefixStart(code)

      // succeed without consuming any input or producing any events
      // if a comment closer can begin at the current position.
      // otherwise, try starting the comment line prefix.
      return effects.attempt(commentCloser, closeComment, prefixStart)(code)
    }

    /**
     * Begin a comment line prefix.
     *
     * Leading padding is consumed before checking whether the current position
     * begins a closer or contains a line marker.
     *
     * @this {void}
     *
     * @param {Code} code
     *  The current character code
     * @return {State | undefined}
     *  The next state
     */
    function prefixStart(this: void, code: Code): State | undefined {
      effects.enter(tt.commentLinePrefix)

      /**
       * Capture optional comment padding after the comment line marker.
       *
       * Padding following the marker is captured in a `commentPadding` token.
       *
       * @const {State} paddingAfter
       */
      const paddingAfter: State = factorySpace(
        effects,
        endPrefix,
        tt.commentPadding,
        constants.commentPaddingSizeMin
      )

      // capture leading padding before a comment closer or line marker.
      return factorySpace(
        effects,
        // check for a comment closer before attempting the line marker.
        // if found, end the prefix before capturing the comment closer.
        // otherwise, capture the line marker and optional padding following it.
        // note: this is required for comments whose first closing marker is the
        // same as their comment line marker (e.g. js/ts block comments).
        effects.check(
          commentCloser,
          endPrefixBeforeCloser,
          // try capturing the comment line marker.
          factoryMarkers(
            effects,
            paddingAfter,
            nok,
            markers.line ?? Number.NEGATIVE_INFINITY
          )
        ),
        tt.commentPadding
      )(code)
    }

    /**
     * Finish the comment line prefix.
     *
     * Control is then passed back to the parent tokenizer.
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

    /**
     * Before a confirmed comment closer.
     *
     * The possible closer was already confirmed with `effects.check`,
     * so the prefix can be ended before the closer is consumed.
     *
     * @this {void}
     *
     * @param {Code} code
     *  The current character code
     * @return {State | undefined}
     *  The next state
     */
    function endPrefixBeforeCloser(this: void, code: Code): State | undefined {
      effects.exit(tt.commentLinePrefix)
      return effects.attempt(commentCloser, closeComment)(code)
    }

    /**
     * Mark the active comment for closure.
     *
     * The `source` initializer owns container finalization.
     * This state records that the comment has reached its closing boundary via
     * {@linkcode self.containerState} without exiting the container directly.
     *
     * @this {void}
     *
     * @param {Code} code
     *  The current character code
     * @return {State | undefined}
     *  The next state
     */
    function closeComment(this: void, code: Code): State | undefined {
      assert(self.containerState, 'expected `containerState` inside comment')
      self.containerState._closeFlow = true
      return ok(code)
    }
  }

  /**
   * Tokenize an alternate comment line prefix.
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
  function tokenizeCommentLinePrefixAlt(
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

    return prefixBefore

    /**
     * Try to begin a comment line prefix.
     *
     * @this {void}
     *
     * @param {Code} code
     *  The current character code
     * @return {State | undefined}
     *  The next state
     */
    function prefixBefore(this: void, code: Code): State | undefined {
      assert(eol(self.previous), 'expected to be at beginning of line')
      if (whitespace(code)) return prefixStart(code)
      return nok(code)
    }

    /**
     * Begin a comment line prefix.
     *
     * Leading padding is consumed based on the `end` column of the current
     * comment opener ({@linkcode self.containerState.opener}).
     *
     * @this {void}
     *
     * @param {Code} code
     *  The current character code
     * @return {State | undefined}
     *  The next state
     */
    function prefixStart(this: void, code: Code): State | undefined {
      assert(self.containerState, 'expected `containerState` inside comment')
      assert(self.containerState.opener, 'expected comment `opener` token')

      // start comment line prefix.
      effects.enter(tt.commentLinePrefix)

      // capture leading padding, then end comment line prefix.
      return factorySpace(
        effects,
        endPrefix,
        tt.commentPadding,
        self.containerState.opener.end.column
      )(code)
    }

    /**
     * Finish the comment line prefix.
     *
     * Control is then passed back to the parent tokenizer.
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
}

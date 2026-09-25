/**
 * @file factoryLineComment
 * @module docmark-factory-line/factory
 */

import type { Markers, Options } from '@flex-development/docmark-factory-line'
import { factoryMarkers } from '@flex-development/docmark-factory-markers'
import { factorySpace } from '@flex-development/docmark-factory-space'
import { blankLine } from '@flex-development/docmark-grammar'
import { constants, ev, kind, tt } from '@flex-development/docmark-util-symbol'
import type {
  Code,
  Construct,
  ContinuableConstruct,
  Effects,
  Event,
  State,
  Token,
  TokenizeContext
} from '@flex-development/docmark-util-types'
import { whitespace } from '@flex-development/mark-util-character'
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

  /**
   * Whether continued lines can be indented in lieu of explicit markers.
   *
   * @const {boolean | undefined} allowIndentedContinuation
   */
  let allowIndentedContinuation: boolean | undefined

  /**
   * The continuation line markers configuration.
   *
   * @var {Markers | undefined} continuationMarkers
   */
  let continuationMarkers: Markers | undefined

  /**
   * The default line markers configuration.
   *
   * @var {Markers} markers
   */
  let markers: Markers

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
   * Tokenize the current line of a line comment.
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

    // get the default marker configuration.
    markers = typeof options.markers === 'function'
      ? options.markers.call(self)
      : options.markers

    // determine if continued lines can be indented.
    allowIndentedContinuation = !!options.allowIndentedContinuation

    // check if continued lines can be indented.
    if (typeof options.allowIndentedContinuation === 'function') {
      allowIndentedContinuation = options.allowIndentedContinuation.call(self)
    }

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
        const { fields } = options

        // start new comment.
        effects.enter(tt.comment, {
          kind: kind.line,
          ...(typeof fields === 'function' ? fields.call(self) : fields)
        })

        // the comment container is fresh.
        // markers are captured inside a `commentOpener` token.
        effects.enter(tt.commentOpener)

        // try capturing comment markers.
        return factoryMarkers(effects, endOpener, nok, markers)(code)
      }

      // the comment container is open.
      // speculative continuation yields an open `commentLinePrefix` token with
      // leading comment padding already captured.
      // the current continuation line markers will be captured next.
      assert(continuationMarkers !== undefined, 'expected continuation markers')

      /**
       * Capture optional padding after markers.
       *
       * @const {State} afterMarkers
       */
      const afterMarkers: State = factorySpace(
        effects,
        endPrefix,
        tt.commentPadding,
        constants.commentPaddingSizeMin
      )

      // try capturing comment markers.
      return factoryMarkers(
        effects,
        afterMarkers,
        nok,
        continuationMarkers
      )(code)
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

      /**
       * The comment opener token.
       *
       * @const {Token} tail
       */
      const tail: Token = effects.exit(tt.commentOpener)

      // propagate comment opener token and width to container state.
      self.containerState.opener = tail
      self.containerState.openerWidth = tail.end.column - tail.start.column

      // mark the comment container as open.
      self.containerState.open = true

      // reset the current continuation markers.
      continuationMarkers = undefined

      // capture optional padding following the opener.
      // **note**: padding is captured ***outside*** the opener,
      // as opposed to inside like `commentLinePrefix` tokens.
      return factorySpace(
        effects,
        ok,
        tt.commentPadding,
        constants.commentPaddingSizeMin
      )(code)
    }

    /**
     * At the end of the comment line prefix.
     *
     * The comment line prefix contains leading comment padding, continuation
     * line markers, and optional inner comment padding.\
     * It ends immediately before comment content.
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
     * The indented line comment continuation construct.
     *
     * @const {Construct} indented
     */
    const indented: Construct = { tokenize: tokenizeIndentedContinuation }

    /**
     * The marked line comment continuation construct.
     *
     * @const {Construct} marked
     */
    const marked: Construct = { tokenize: tokenizeMarkedContinuation }

    return effects.attempt(marked, ok, effects.attempt(indented, ok, nok))
  }

  /**
   * Tokenize an indented comment line.
   *
   * An indented continuation line starts with leading comment padding.
   * Leading padding must be aligned with the active comment opener.
   * Alignment is achieved when the end column of the relevant `commentPadding`
   * token is equal to the opener's start column.
   *
   * The remaining whitespace is expected to fulfill the indentation criteria.
   * The indent must span at least one whitespace and is matched as a marker
   * sequence whose width is derived from the comment opener width.
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
  function tokenizeIndentedContinuation(
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

    return effects.check(blankLine, ok, lineStart)

    /**
     * Begin an indented continued comment line.
     *
     * Leading comment padding is captured before attempting the opener-based
     * line marker sequence.
     *
     * > 👉 **Note**: `␊` represents a line ending
     * > and `ᴺᵁᴸ` represents end-of-stream.
     *
     * @example
     *  ```markdown
     *  > |// the comment container is open.␊
     *  > | markers are captured inside a `commentLinePrefix` token.␊
     *     ^
     *  > |␊
     *  ```
     *
     * @example
     *  ```markdown
     *  > |      // capture leading comment padding.␊
     *  > |         padding is no larger than the start column of the opener.ᴺᵁᴸ
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
      assert(self.containerState, 'expected `containerState` inside comment')
      assert(self.containerState.opener, 'expected comment opener token')

      // indented continuation line not allowed here.
      if (!allowIndentedContinuation) return nok(code)

      // indented syntax allowed, but no indent.
      // succeed at blank line, but fail if indent cannot otherwise begin.
      if (!whitespace(code)) return effects.check(blankLine, ok, nok)(code)

      // begin comment line prefix.
      effects.enter(tt.commentLinePrefix)

      // capture leading comment padding.
      // padding size is no larger than the start column of the opener,
      // i.e. the max size is `self.containerState.opener.start.column - 1`.
      return factorySpace(
        effects,
        afterLeadingPadding,
        tt.commentPadding,
        self.containerState.opener.start.column
      )(code)
    }

    /**
     * Attempt to tokenize comment line markers.
     *
     * A valid line marker for an indented continued line is any character code
     * that satisfies the {@linkcode whitespace} predicate.
     *
     * The continuation line marker sequence, {@linkcode continuationMarkers},
     * is derived from the width of the active comment opener.\
     * The first marker is required; all remaining markers are optional.
     * This means an indented continuation line has an indentation size anywhere
     * in the inclusive range `[1,self.containerState.openerWidth]`.
     *
     * The {@linkcode lineComment} construct is attempted from the current point
     * in the stream after building the continuation line marker sequence.
     *
     * > 👉 **Note**: `␊` represents a line ending
     * > and `ᴺᵁᴸ` represents end-of-stream.
     *
     * @example
     *  ```markdown
     *  > |// the comment container is open.␊
     *  > | markers are captured inside a `commentLinePrefix` token.␊
     *     ^
     *  > |␊
     *  ```
     *
     * @example
     *  ```markdown
     *  > |      // capture leading comment padding.␊
     *  > |         padding ends no later than the opener start column.ᴺᵁᴸ
     *           ^
     *  ```
     *
     * @this {void}
     *
     * @param {Code} code
     *  The current character code
     * @return {State | undefined}
     *  The next state
     */
    function afterLeadingPadding(this: void, code: Code): State | undefined {
      assert(self.containerState, 'expected `containerState` inside comment')
      assert(self.containerState.opener, 'expected comment opener token')
      assert(self.containerState.openerWidth, 'expected comment opener width')

      /**
       * The last emitted event.
       *
       * @const {Event | undefined} tail
       */
      const tail: Event | undefined = self.events[self.events.length - 1]

      assert(tail, 'expected `tail` event')
      assert(tail[1].type === tt.commentPadding, 'expected `commentPadding`')
      assert(tail[0] === ev.exit, 'expected `commentPadding` `exit` event')

      // not on an active comment line; padding is not aligned.
      // leading comment padding must end directly below the comment opener.
      // **note**: "directly below" means the end column of the `tail` token is
      // equal to the start column of the comment opener and the current line is
      // further than the opener's start line (i.e. like now,
      // where `self.now().line > self.containerState.opener.start.line`).
      if (tail[1].end.column !== self.containerState.opener.start.column) {
        return nok(code)
      }

      // no leading comment padding even though whitespace was encountered.
      // only `self.containerState.opener.start.column - 1` whitespace codes
      // were allowed to be consumed by `lineStart`.
      // this results in an empty `commentPadding` token when the comment opener
      // starts at the beginning of its line.
      // the corresponding events are discarded by mutating `self.events.length`
      // to avoid iterating over a potentially large event list in a resolver.
      if (tail[1].end.column - tail[1].start.column === 0) {
        self.events.length -= 2 // adjust event list length to drop events.
      }

      // populate the continuation line marker sequence.
      // the first marker is required; all other markers are optional.
      continuationMarkers = [whitespace]
      continuationMarkers.length = self.containerState.openerWidth
      continuationMarkers.fill({ code: whitespace, optional: true }, 1)

      // use `lineComment` to finish out the continuation attempt.
      // the new marker sequence will be used, not `options.markers`.
      // success means this line is indented and continues the active comment.
      // failure means this line is not an indented or continued line.
      return effects.attempt(lineComment, ok, nok)(code)
    }
  }

  /**
   * Tokenize a marked continued line.
   *
   * A marked continuation line begins with optional leading comment padding
   * followed by the marker sequence established by the current line comment
   * configuration ({@linkcode options.markers}).
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
  function tokenizeMarkedContinuation(
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
     * Leading comment padding is captured before attempting line markers.
     *
     * > 👉 **Note**: `␊` represents a line ending.
     *
     * @example
     *  ```markdown
     *  > |// the comment container is open.␊
     *  > |// markers are captured inside a `commentLinePrefix` token.␊
     *     ^
     *  ```
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

      // begin comment line prefix.
      effects.enter(tt.commentLinePrefix)

      // capture leading comment padding, then try capturing markers.
      return factorySpace(effects, afterLeadingPadding, tt.commentPadding)(code)
    }

    /**
     * Attempt to tokenize comment line markers after capturing leading padding.
     *
     * The {@linkcode lineComment} construct is attempted from the current point
     * in the stream.
     *
     * > 👉 **Note**: `␊` represents a line ending.
     *
     * @example
     *  ```markdown
     *  > |// the comment container is open.␊
     *  > |// markers are captured inside a `commentLinePrefix` token.␊
     *     ^
     *  ```
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
    function afterLeadingPadding(this: void, code: Code): State | undefined {
      assert(typeof markers !== 'undefined', 'expected `markers` configuration')

      // use the default markers configuration.
      continuationMarkers = markers

      // use `lineComment` to finish out the continuation attempt.
      // the markers established by `markers` will be used.
      // success means this line is marked and continues the active comment.
      // failure means this line is not a marked or continued line.
      return effects.attempt(lineComment, ok, nok)(code)
    }
  }
}

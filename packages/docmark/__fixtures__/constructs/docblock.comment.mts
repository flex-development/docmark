/**
 * @file Constructs - docblock
 * @module docmark/fixtures/docblock
 */

import { factorySpace } from '@flex-development/docmark-factory-space'
import {
  blankLine,
  eoc,
  trailingWhitespace
} from '@flex-development/docmark-grammar'
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
  PartialConstruct,
  Place,
  Position,
  State,
  TokenizeContext
} from '@flex-development/docmark-util-types'
import { eol, eos, whitespace } from '@flex-development/mark-util-character'
import { ok as assert } from 'devlop'

/**
 * The docblock comment construct.
 *
 * @const {ContinuableConstruct & NamedConstruct} docblock
 */
const docblock: ContinuableConstruct & NamedConstruct = {
  continuation: { tokenize: tokenizeDocBlockContinuation },
  exit: exitComment,
  name: `${tt.comment}:${kind.docblock}`,
  tokenize: tokenizeDocBlock
}

export default docblock

/**
 * The comment opener construct.
 *
 * A comment opener begins a docblock comment.
 * The opener consists of a forward slash (`/`)
 * followed by two asterisks (`**`).
 *
 * Whitespace following the marker may be recognized separately as comment line
 * padding or, when it reaches the end of the line, as a line suffix.
 *
 * @const {PartialConstruct} commentOpener
 */
const commentOpener: PartialConstruct = {
  partial: true,
  tokenize: tokenizeCommentOpener
}

/**
 * The comment closer construct.
 *
 * A comment closer terminates a docblock comment.
 * The closing marker consists of an asterisk (`*`) immediately followed by a
 * forward slash (`/`).
 *
 * One leading whitespace character may be recognized separately as comment
 * line padding.
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
 * @const {PartialConstruct} trailingCommentCloser
 */
const trailingCommentCloser: PartialConstruct = {
  partial: true,
  tokenize: tokenizeTrailingCommentCloser
}

/**
 * The comment line prefix construct.
 *
 * A comment line prefix occurs at the beginning of a line within a comment.
 * It may contain leading comment line padding, a single asterisk (`*`) line
 * marker, and optional padding following the marker.
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
 * Exit the active comment.
 *
 * @this {TokenizeContext}
 *
 * @param {Effects} effects
 *  The context object used to transition the state machine
 * @return {undefined}
 */
function exitComment(this: TokenizeContext, effects: Effects): undefined {
  return void effects.exit(tt.comment)
}

/**
 * Tokenize the first line of a docblock comment.
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
function tokenizeDocBlock(
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
   * Attempt to begin a docblock comment.
   *
   * The comment container is entered before the opener is attempted.
   * If the opener fails, the construct fails.
   * This is the only failure point.
   *
   * > 👉 **Note**: `␊` represents a line ending, `␠` represents a space,
   * > and `ᴺᵁᴸ` represents end-of-stream.
   *
   * @example
   *  ```markdown
   *  > |/***\/
   *     ^
   *  ```
   * @example
   *  ```markdown
   *  > |/**ᴺᵁᴸ
   *     ^
   *  ```
   *
   * @example
   *  ```markdown
   *  > |/**␠␠␊
   *     ^
   *  ```
   *
   * @example
   *  ```markdown
   *  > |/** ... *\/
   *     ^
   *  ```
   *
   * @example
   *  ```markdown
   *  > |/**␠␠␠*\/
   *     ^
   *  ```
   *
   * @example
   *  ```markdown
   *  > |/** @type {Construct} *\/
   *     ^
   *  ```
   *
   * @example
   *  ```markdown
   *  > |/**@const {TokenizeContext} self &mdash; The tokenization context.*\/
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
    assert(code === codes.slash, 'expected `codes.slash`')

    // start new comment.
    effects.enter(tt.comment, { _container: true, _kind: kind.docblock })

    // capture opener and any trailing whitespace or padding following it.
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
   *  > |/**␊
   *        ^
   *  ```
   *
   * @example
   *  ```markdown
   *  > |/**␠␠␠␊
   *          ^
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
   *  > |/**␠␠*\/
   *         ^
   *  ```
   *
   * @example
   *  ```markdown
   *  > |/** One place in a source *file* *\/
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
  function afterOpener(this: void, code: Code): State | undefined {
    assert(self.containerState, 'expected `containerState` inside comment')

    // comment opener detected unterminated comment and closed container.
    // comment was terminated by end of stream, end of stream after one or more
    // blank lines, end of stream after whitespace, or
    // end of stream after whitespace followed by one or more blank lines.
    if (self.containerState._closeFlow) return ok(code)
    assert(!eos(code), 'did not expect end of stream')

    // comment opener detected trailing whitespace.
    if (eol(self.previous)) return ok(code)

    // capture line ending.
    // the comment container is still open.
    // `tokenizeCommentContinuation` will take over from here.
    // if line ending is handled by markdown tokenizers, it will be considered a
    // blank line even though the comment opener is on this line.
    // the `contentType` assignment is required for the `source` initializer to
    // link the token appropriately.
    if (eol(code)) {
      effects.enter(tt.lineEnding)
      effects.consume(code)
      effects.exit(tt.lineEnding)
      return ok
    }

    // check for comment closer before committing asterisk to chunk.
    if (code === codes.asterisk) {
      return effects.attempt(commentCloser, endComment, startChunk)(code)
    }

    // check for comment closer sequence before starting chunk.
    // on failure, capture any whitespace so its not considered a line prefix.
    if (whitespace(code)) {
      return effects.attempt(
        commentCloser,
        endComment,
        effects.attempt(
          trailingCommentCloser,
          endComment,
          factorySpace(effects, startChunk, tt.whitespace)
        )
      )(code)
    }

    // first chunk starts on the same line as opener.
    return startChunk(code)
  }

  /**
   * Start the first comment chunk.
   *
   * The first chunk begins on the same line as the comment opener.
   *
   * > 👉 **Note**: `␠` represents a space.
   *
   * @example
   *  ```markdown
   *  > |/**␠ ␠*\/
   *         ^
   *  ```
   *
   * @example
   *  ```markdown
   *  > |/** @type {Construct}
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
   * A possible closer is checked before an asterisk or whitespace is committed
   * to the chunk.
   *
   * At a line ending, the chunk is closed.
   * Later lines are handled by {@linkcode tokenizeDocBlockContinuation}.
   *
   * > 👉 **Note**: `␊` represents a line ending and `␠` represents a space.
   *
   * @example
   *  ```markdown
   *  > |/**␠ ␠*\/
   *         ^
   *  ```
   *
   * @example
   *  ```markdown
   *  > |/** @type {Construct} *\/
   *         ^^^^^^^^^^^^^^^^^
   *  ```
   *
   * @example
   *  ```markdown
   *  > |/** @internal␊
   *         ^^^^^^^^^^
   *  ```
   *
   * @example
   *  ```markdown
   *  > |/** Location utility.␠␠␠␊
   *         ^^^^^^^^^^^^^^^^^
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
    // `tokenizeCommentContinuation` will take over from here.
    if (eol(code)) {
      effects.consume(code)
      effects.exit(tt.chunkComment)
      return ok
    }

    // check for comment closer sequence before adding asterisk to chunk.
    if (code === codes.asterisk) {
      return effects.check(commentCloser, beforeInlineCloser, addToChunk)(code)
    }

    // check for comment closer sequence before adding whitespace to chunk.
    if (whitespace(code)) {
      return effects.check(commentCloser, beforeInlineCloser, addToChunk)(code)
    }

    // consume code and move onto the next.
    return addToChunk(code)
  }

  /**
   * Finish the first chunk before an inline comment closer.
   *
   * The possible closer was already confirmed with `effects.check`,
   * so the chunk can be closed before the closer is consumed.
   *
   * @example
   *  ```markdown
   *  > |/** @type {Construct} *\/
   *                          ^
   *  ```
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
    return effects.attempt(commentCloser, endComment)(code)
  }

  /**
   * Add the current character code to the first comment chunk.
   *
   * This state is reached after checking for an inline comment closer,
   * or after ordinary content is seen inside a comment chunk.
   *
   * @example
   *  ```markdown
   *  > |/** One place in a source *file* *\/
   *                                ^
   *  ```
   *
   * @example
   *  ```markdown
   *  > |/** @type {Construct} *\/
   *                 ^
   *  ```
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
   * @example
   *  ```markdown
   *  > |/** @type {Construct} *\/
   *                              ^
   *  ```
   *
   * @example
   *  ```markdown
   *  > |/** One place in a source *file* *\/
   *                                        ^
   *  ```
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function endComment(this: void, code: Code): State | undefined {
    assert(self.containerState, 'expected `containerState` inside comment')
    self.containerState._closeFlow = true
    return ok(code)
  }
}

/**
 * Continue tokenizing an open block comment.
 *
 * A continuation begins at the start of a line. Comment line prefixes and line
 * indentation are processed before another comment chunk is started.
 *
 * The continuation may also recognize the comment closer and mark the active
 * container for closure.
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
function tokenizeDocBlockContinuation(
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
   * When the marker required by the prefix is not present, line indentation is
   * attempted directly.
   *
   * Both paths leave control at the beginning of normalized comment content.
   *
   * @example
   *  ```markdown
   *  > |   * Begin a continued comment line.
   *     ^
   *  ```
   *
   * @example
   *  ```markdown
   *  > |   @module docmark/constructs/comment
   *     ^
   *  ```
   *
   * @example
   *  ```markdown
   *  > | *\/
   *     ^
   *  ```
   *
   * @example
   *  ```markdown
   *  > |*\/
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

    // comment terminated by end of stream.
    if (eos(code)) return nok(code)

    // try capturing comment line prefix.
    // the construct only fails if a comment line marker is missing,
    // but can succeed without a marker before a comment closer as well.
    // the comment container is marked for closure by `commentLinePrefix`
    // if a comment closer is detected.
    return effects.attempt(
      commentLinePrefix,
      effects.check(blankLine, ok, afterLineStart),
      afterLineStart
    )(code)
  }

  /**
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function afterLineStart(this: void, code: Code): State | undefined {
    assert(self.containerState, 'expected `containerState` inside comment')

    // concrete subcontent encountered on previous line.
    // bypass chunk creation and implicit comment closer check.
    if (self.concrete) return ok(code)

    // `commentLinePrefix` requested comment container closure
    // or comment terminated by end of stream.
    if (self.containerState._closeFlow || eos(code)) return ok(code)

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

    // start comment chunk.
    return beforeChunk(code)
  }

  /**
   * Prepare to start a continued comment chunk.
   *
   * If the current `comment` tokenizer encountered concrete content on the
   * previous line, control returns to the `source` initializer.
   *
   * Otherwise, a possible closer is attempted before the chunk begins.
   *
   * @example
   *  ```markdown
   *  > | * @file Constructs - comment
   *        ^
   *  ```
   *
   * @example
   *  ```markdown
   *  > |   @module docmark/constructs/comment
   *        ^
   *  ```
   *
   * @example
   *  ```markdown
   *  > |   * *a*
   *          ^
   *  ```
   *
   * @example
   *  ```markdown
   *  > | *\/
   *      ^
   *  ```
   *
   * @example
   *  ```markdown
   *  > |*\/
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
  function beforeChunk(this: void, code: Code): State | undefined {
    assert(self.containerState, 'expected `containerState` inside comment')
    assert(!self.concrete, 'did not expect concrete subcontent')
    assert(!eos(code), 'did not expect end of stream')

    // start chunk on code that cannot begin a comment closer.
    if (code !== codes.asterisk) return startChunk(code)

    // check for a comment closer.
    // if found, mark the comment container for closure.
    // otherwise, start comment content chunk.
    return effects.attempt(commentCloser, closeContainer, startChunk)(code)
  }

  /**
   * Start a continued comment chunk.
   *
   * Comment line prefixes have already been consumed.
   * The chunk therefore begins at normalized comment content.
   *
   * @example
   *  ```markdown
   *  > | * @file Constructs - comment
   *        ^
   *  ```
   *
   * @example
   *  ```markdown
   *  > |   @module docmark/constructs/comment
   *        ^
   *  ```
   *
   * @example
   *  ```markdown
   *  > | *␊
   *       ^
   *  ```
   *
   * @example
   *  ```markdown
   *  > |   * Start a continued comment chunk.
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
  function startChunk(this: void, code: Code): State | undefined {
    assert(!self.concrete, 'did not expect concrete subcontent')
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
   * Content is consumed through the end of the line.
   * A possible closer is checked before an asterisk or whitespace is committed
   * to the chunk.
   *
   * The completed chunk includes its line ending when one is present.
   *
   * > 👉 **Note**: `␊` represents a line ending.
   *
   * @example
   *  ```markdown
   *  > |   * Continue a comment chunk on a continued line.␊
   *          ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
   *  > |   *␊
   *         ^
   *  ```
   *
   * @example
   *  ```markdown
   *  > |   * Inside comment chunk. *\/
   *          ^^^^^^^^^^^^^^^^^^^^^
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

    // check for eos after one or more blank lines.
    // on failure, finish chunk after line ending.
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
      // we signal markdown indentation to allow continued indented code checks
      // for the next line and delegate comment content chunk creation to the
      // `source` initializer to bypass any remaining comment closer checks.
      if (self.sliceSerialize(range, true).length >= constants.tabSize) {
        assert(self.containerState, 'expected `containerState` inside comment')

        // signal markdown indentation.
        self.containerState.markdownIndent = true

        // end of line prefix.
        // finish comment content chunk.
        effects.exit(tt.chunkComment)

        // delegate chunk creation to the `source` initializer.
        // the initializer will create a separate chunk for the rest of the line
        // and link it to the chunk we just closed.
        // on the next continuation attempt, we'll start at beginning of the
        // next line instead of the current position.
        return ok(code)
      }

      // no indented code prefix.

      // discard whitespace start point.
      then = undefined
    }

    // check for comment closer sequence
    // before committing asterisk or whitespace to chunk.
    if (code === codes.asterisk || whitespace(code)) {
      return effects.check(commentCloser, beforeCloser, addToChunk)(code)
    }

    // consume code and move onto the next.
    return addToChunk(code)
  }

  /**
   * Add the current character code to a continued comment chunk.
   *
   * This state is reached after ordinary content or a failed closer check.
   *
   * @example
   *  ```markdown
   *  > | * a *b*
   *          ^
   *  ```
   *
   * @example
   *  ```markdown
   *  > | * The current place in the content.
   *            ^
   *  ```
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
   * After consuming the closer, the end-of-content construct determines whether
   * the comment container should close at the current position.
   *
   * > 👉 **Note**: `␊` represents a line ending.
   *
   * @example
   *  ```markdown
   *  > |   * @return {State | undefined}␊
   *  > |   *  The next state *\/
   *                         ^
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
    return effects.attempt(commentCloser, closeContainer)(code)
  }

  /**
   * Mark the continued comment for closure.
   *
   * Container finalization is deferred to the `source` initializer.
   *
   * > 👉 **Note**: `␊` represents a line ending.
   *
   * @example
   *  ```markdown
   *     > |   *  The next state␊
   *     > |   *\/␊
   *           ^
   *  ```
   *
   * @example
   *  ```markdown
   *  > |   * @return {State | undefined}␊
   *  > |   *  The next state *\/
   *                             ^
   *  > |␊
   *  ```
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function closeContainer(this: void, code: Code): State | undefined {
    assert(self.containerState, 'expected `containerState` inside comment')
    self.containerState._closeFlow = true
    return ok(code)
  }
}

/**
 * Tokenize a block comment opener.
 *
 * The default opening marker is `/**`.
 * Whitespace immediately following the marker is recognized separately as
 * either line padding or a line suffix.
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
    assert(code === codes.slash, 'expected `codes.slash`')
    return effects.enter(tt.commentOpener), effects.consume(code), afterSlash
  }

  /**
   * Continue a comment opener after the initial slash.
   *
   * @example
   *  ```markdown
   *  > |/**
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
  function afterSlash(this: void, code: Code): State | undefined {
    if (code !== codes.asterisk) return nok(code)
    return effects.consume(code), lastAsterisk
  }

  /**
   * Finish a comment opener.
   *
   * The second asterisk completes the opening marker.
   * Whitespace following the marker is then attempted as a line suffix or
   * consumed as comment line padding.
   *
   * > 👉 **Note**: `␊` represents a line ending, `␠` represents a space,
   * > and `ᴺᵁᴸ` represents end-of-stream.
   *
   * @example
   *  ```markdown
   *  > |/**ᴺᵁᴸ
   *       ^
   *  ```
   *
   * @example
   *  ```markdown
   *  > |/**␠␠
   *       ^
   *  ```
   *
   * @example
   *  ```markdown
   *  > |/**␊
   *       ^
   *  ```
   *
   * @example
   *  ```markdown
   *  > |/**␠␠␊
   *       ^
   *  ```
   *
   * @example
   *  ```markdown
   *  > |/**␠@type {Construct}
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
  function lastAsterisk(this: void, code: Code): State | undefined {
    if (code !== codes.asterisk) return nok(code)

    effects.consume(code)
    effects.exit(tt.commentOpener)

    return afterLastAsterisk
  }

  /**
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
   *  > |/**␊
   *        ^
   *  > |ᴺᵁᴸ
   *  ```
   *
   * @example
   *  ```markdown
   *  > |/**␠␠␠ᴺᵁᴸ
   *        ^
   *  ```
   *
   * @example
   *  ```markdown
   *  > |/**␠␠␠␊
   *        ^
   *  > |ᴺᵁᴸ
   *  ```
   *
   * @example
   *  ```markdown
   *  > |/**@this {void}
   *        ^
   *  ```
   *
   * @example
   *  ```markdown
   *  > |/** @type {Construct}
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
  function afterLastAsterisk(this: void, code: Code): State | undefined {
    // check for end of stream (eos) sequence.
    // comment can terminate after immediate eos,
    // eos after one or more blank lines or whitespace,
    // or eos after whitespace followed by one or more blank lines.
    // on success, the comment container will be marked for closure.
    if (eos(code)) return closeContainer(code)

    // check for end of stream (eos) sequence.
    // comment can terminate after immediate eos,
    // eos after one or more blank lines or whitespace,
    // or eos after whitespace followed by one or more blank lines.
    // on success, the comment container will be marked for closure.
    if (eol(code)) return effects.check(eoc, closeContainer, ok)(code)

    // check for eos sequence before attempting to capture trailing whitespace.
    // this forces `trailingWhitespace` to succeed only when whitespace is
    // followed by a line ending, rather than eos *or* a line ending.
    if (whitespace(code)) {
      return effects.check(
        eoc,
        closeContainer,
        effects.attempt(trailingWhitespace, ok, noTrailingWhitespace)
      )(code)
    }

    return ok(code)
  }

  /**
   * Mark the comment container for closure.
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
   *  > |/**␊ᴺᵁᴸ
   *        ^
   *  ```
   *
   * @example
   *  ```markdown
   *  > |/**␠␠␠ᴺᵁᴸ
   *       ^
   *  ```
   *
   * @example
   *  ```markdown
   *  > |/**␠␠␠
   *  > |␊ᴺᵁᴸ
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
  function closeContainer(this: void, code: Code): State | undefined {
    assert(self.containerState, 'expected `containerState` inside comment')
    self.containerState._closeFlow = true
    return ok(code)
  }

  /**
   * @example
   *  ```markdown
   *  > |/** *\/
   *        ^
   *  ```
   *
   * @example
   *  ```markdown
   *  > |/** @internal *\/
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
  function noTrailingWhitespace(this: void, code: Code): State | undefined {
    assert(whitespace(code), 'expected whitespace code')

    // check for comment closer sequence.
    // on success, capture the leading whitespace as `whitespace` instead of
    // capturing as `commentPadding`. this will force the comment closer to
    // construct only succeed when an actual closer is seen.
    // on failure, the first whitespace character can be seen as padding.
    return effects.check(
      commentCloser,
      closerAfterWhitespace,
      factorySpace(
        effects,
        ok,
        tt.commentPadding,
        constants.commentPaddingSizeMin
      )
    )(code)
  }

  /**
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function closerAfterWhitespace(this: void, code: Code): State | undefined {
    assert(whitespace(code), 'expected whitespace code')

    effects.enter(tt.whitespace)
    effects.consume(code)
    effects.exit(tt.whitespace)

    return ok
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
    closerStart,
    tt.commentPadding,
    constants.commentPaddingSizeMin
  )

  /**
   * Attempt to begin a comment closer.
   *
   * > 👉 **Note**: `•` represents an asterisk.
   *
   * @example
   *  ```markdown
   *  > |•/
   *     ^
   *  ```
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
  function closerStart(this: void, code: Code): State | undefined {
    if (code !== codes.asterisk) return nok(code)
    return effects.enter(tt.commentCloser), effects.consume(code), afterMarker
  }

  /**
   * Finish a comment closer.
   *
   * > 👉 **Note**: `•` represents an asterisk.
   *
   * @example
   *  ```markdown
   *  > |•/
   *      ^
   *  ```
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
  function afterMarker(this: void, code: Code): State | undefined {
    if (code !== codes.slash) return nok(code)
    return effects.consume(code), effects.exit(tt.commentCloser), ok
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
  return trailStart

  /**
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function trailStart(this: void, code: Code): State | undefined {
    assert(whitespace(code), 'expected whitespace code')
    return effects.enter(tt.whitespace), effects.consume(code), insideTrail
  }

  /**
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
 * Leading padding, an optional line marker (`*`), and padding following the
 * marker are captured and thereby from normalized comment content.
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
   * Fails if a comment closer can begin at the current position.
   *
   * @example
   *  ```markdown
   *  > |   * At the beginning of a comment line.
   *     ^
   *  ```
   *
   * @example
   *  ```markdown
   *  > |*\/
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
  function prefixBefore(this: void, code: Code): State | undefined {
    assert(eol(self.previous), 'expected to be at beginning of line')
    if (code !== codes.asterisk) return prefixStart(code)
    return effects.attempt(commentCloser, closeContainer, prefixStart)(code)
  }

  /**
   * Begin a comment line prefix.
   *
   * Leading padding is consumed before checking whether the current position
   * begins a closer or contains a line marker.
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
  function prefixStart(this: void, code: Code): State | undefined {
    effects.enter(tt.commentLinePrefix)

    return factorySpace(
      effects,
      effects.check(commentCloser, beforeCloser, atMarker),
      tt.commentPadding
    )(code)
  }

  /**
   * Consume a comment line marker.
   *
   * A line marker consists of one asterisk (`*`). Optional padding following
   * the marker is captured in a `commentPadding` token.
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
  function atMarker(this: void, code: Code): State | undefined {
    if (code !== codes.asterisk) return nok(code)

    effects.enter(tt.commentLineMarker)
    effects.consume(code)
    effects.exit(tt.commentLineMarker)

    return factorySpace(
      effects,
      afterPadding,
      tt.commentPadding,
      constants.commentPaddingSizeMin
    )
  }

  /**
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function afterPadding(this: void, code: Code): State | undefined {
    effects.exit(tt.commentLinePrefix)
    return ok(code)
  }

  /**
   * Before a confirmed comment closer.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function beforeCloser(this: void, code: Code): State | undefined {
    effects.exit(tt.commentLinePrefix)
    return effects.attempt(commentCloser, closeContainer)(code)
  }

  /**
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function closeContainer(this: void, code: Code): State | undefined {
    assert(self.containerState, 'expected `containerState` inside comment')
    self.containerState._closeFlow = true
    return ok(code)
  }
}

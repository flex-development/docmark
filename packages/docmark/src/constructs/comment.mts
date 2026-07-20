/**
 * @file Constructs - comment
 * @module docmark/constructs/comment
 */

import { factorySpace } from '@flex-development/docmark-factory-space'
import { codes, constants, tt } from '@flex-development/docmark-util-symbol'
import type {
  Code,
  ContinuableConstruct,
  Effects,
  NamedConstruct,
  PartialConstruct,
  State,
  Token,
  TokenizeContext
} from '@flex-development/docmark-util-types'
import { eol, eos, whitespace } from '@flex-development/mark-util-character'
import { ok as assert } from 'devlop'
import eoc from './eoc.mts'
import linePrefix from './line-prefix.mts'
import lineSuffix from './line-suffix.mts'

/**
 * The block comment construct.
 *
 * The construct recognizes a block comment and maintains its container state
 * across lines. Comment content is emitted as `chunkComment` tokens for
 * processing by a child `comment` tokenizer.
 *
 * The construct defines its own continuation and exit behavior so the source
 * initializer can treat comments as continuable containers.
 *
 * @const {ContinuableConstruct & NamedConstruct} comment
 */
const comment: ContinuableConstruct & NamedConstruct = {
  continuation: { tokenize: tokenizeCommentContinuation },
  exit: exitComment,
  name: tt.comment,
  previous: previousComment,
  tokenize: tokenizeComment
}

/**
 * The comment opener construct.
 *
 * A comment opener begins a block comment. The default opener consists of a
 * forward slash (`/`) followed by two asterisks (`**`).
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
 * A comment closer terminates a block comment. The closing marker consists of
 * an asterisk (`*`) immediately followed by a forward slash (`/`).
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
 * The comment line prefix construct.
 *
 * A comment line prefix occurs at the beginning of a line within a comment.
 * It may contain leading comment line padding, a single asterisk (`*`) line
 * marker, and optional padding following the marker.
 *
 * A prefix may also consist only of padding when the next input begins the
 * comment closer. Indentation following the prefix is recognized separately by
 * {@linkcode linePrefix}.
 *
 * @const {PartialConstruct} commentLinePrefix
 */
const commentLinePrefix: PartialConstruct = {
  partial: true,
  previous: eol,
  tokenize: tokenizeCommentLinePrefix
}

export default comment

/**
 * Exit the active block comment container.
 *
 * The source initializer calls this hook after the comment content stream has
 * been finalized.
 *
 * @this {TokenizeContext}
 *
 * @param {Effects} effects
 *  The context object to transition the state machine
 * @return {undefined}
 */
function exitComment(this: TokenizeContext, effects: Effects): undefined {
  assert(this.containerState, 'expected `containerState` in container')
  effects.exit(tt.comment)
  return void effects
}

/**
 * Check whether a block comment may begin after `code`.
 *
 * An opener immediately preceded by a backslash is not considered the beginning
 * of a block comment.
 *
 * @this {TokenizeContext}
 *
 * @param {Code} code
 *  The previous character code
 * @return {boolean}
 *  Whether a comment may begin after `code`
 */
function previousComment(this: TokenizeContext, code: Code): boolean {
  return code !== codes.backslash
}

/**
 * Tokenize the beginning of a comment.
 *
 * The tokenizer recognizes the opening marker and processes content remaining
 * on the same line. Multiline content is handled later by
 * {@linkcode tokenizeCommentContinuation}.
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
function tokenizeComment(
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

  return commentStart

  /**
   * Attempt to begin a comment.
   *
   * The comment container is entered before the opener is attempted.
   * If the opener fails, the construct fails.
   * This is the only failure point.
   *
   * @example
   *  ```markdown
   *  > |/***\/
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
   *  > |/**   *\/
   *     ^
   *  ```
   *
   * @example
   *  ```markdown
   *  > |/** @type {Construct} *\/
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
  function commentStart(this: void, code: Code): State | undefined {
    assert(code === codes.slash, 'expected `codes.slash`')

    // start new comment.
    effects.enter(tt.comment, { _container: true })

    // capture opener and any padding or suffix following it.
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
   * > 👉 **Note**: `␊` represents a line ending and `␠` represents a space.
   *
   * @example
   *  ```markdown
   *  > |/**␊
   *        ^
   *  ```
   *
   * @example
   *  ```markdown
   *  > |/**␠␊
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
   *  > |/**  *\/
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
  function afterOpener(this: void, code: Code): State | undefined {
    // comment terminated by end of stream.
    if (eos(code)) return endComment(code)

    // capture line ending.
    // the comment container is still open.
    // `tokenizeCommentContinuation` will take over from here.
    // if line ending is handled by markdown tokenizers, it will be considered a
    // blank line even though the comment opener is on this line.
    if (eol(code)) {
      effects.enter(tt.lineEnding)
      effects.consume(code)
      effects.exit(tt.lineEnding)
      return ok
    }

    // check for comment closer sequence before starting comment chunk.
    if (code === codes.asterisk || whitespace(code)) {
      return effects.attempt(commentCloser, endComment, startChunk)(code)
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
    assert(!eol(code), 'cannot start chunk on line ending')

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
   * Later lines are handled by {@linkcode tokenizeCommentContinuation}.
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
   *  > |/** Location utility.
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
      return endComment(code)
    }

    // finish comment chunk after first line ending.
    // the comment container is still open.
    // `tokenizeCommentContinuation` will take over from here.
    if (eol(code)) {
      effects.consume(code)
      effects.exit(tt.chunkComment)
      return ok
    }

    // check for a comment closer sequence
    // before adding an asterisk or whitespace to the chunk.
    if (code === codes.asterisk || whitespace(code)) {
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

    // closer confirmed, no need for failure state.
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
 *  The context object to transition the state machine
 * @param {State} ok
 *  The successful tokenization state
 * @param {State} nok
 *  The failed tokenization state
 * @return {State}
 *  The initial state
 */
function tokenizeCommentContinuation(
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
   * A comment line prefix is attempted first. When the marker required by the
   * prefix is not present, line indentation is attempted directly.
   *
   * Both paths leave control at the beginning of normalized comment content.
   *
   * > 👉 **Note**: `␊` represents a line ending and `␠` represents a space.
   *
   * @example
   *  ```markdown
   *  > |* @file Constructs - comment
   *     ^
   *  ```
   *
   * @example
   *  ```markdown
   *  > | @module docmark/constructs/comment
   *     ^
   *  ```
   *
   * @example
   *  ```markdown
   *  > |   * Start of a comment line.
   *     ^
   *  ```
   *
   * @example
   *  ```markdown
   *  > |/**␠␠␠␊
   *  > |␊
   *     ^
   *  ```
   *
   * @example
   *  ```markdown
   *  > |*\/
   *     ^
   *  ```
   *
   * @example
   *  ```markdown
   *  > | *\/
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
  function lineStart(this: void, code: Code): State | undefined {
    assert(eol(self.previous), 'expected to be at beginning of line')
    if (eos(code)) return nok(code)

    // try capturing comment line prefix.
    // on failure, try capture line indentation.
    return effects.attempt(
      commentLinePrefix,
      beforeChunk,
      effects.attempt(linePrefix, beforeChunk, beforeChunk)
    )(code)
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
   *  > |* @file Constructs - comment
   *       ^
   *  ```
   *
   * @example
   *  ```markdown
   *  > | @module docmark/constructs/comment
   *      ^
   *  ```
   *
   * @example
   *  ```markdown
   *  > |   * Before starting a comment chunk.
   *          ^
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
   *  > |   *\/
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
  function beforeChunk(this: void, code: Code): State | undefined {
    assert(!eos(code), 'did not expect end of stream')

    // concrete content from markdown tokenizer encountered on previous line.
    if (self.concrete) return ok(code)

    // check for comment closer sequence before starting comment chunk.
    if (code === codes.asterisk || whitespace(code)) {
      return effects.attempt(commentCloser, beforeEnd, startChunk)(code)
    }

    // start comment chunk.
    return startChunk(code)
  }

  /**
   * Start a continued comment chunk.
   *
   * Comment line prefixes and removable line indentation have already
   * been consumed. The chunk therefore begins at normalized comment content.
   *
   * > 👉 **Note**: `␊` represents a line ending.
   *
   * @example
   *  ```markdown
   *  > | *␊
   *       ^
   *  ```
   *
   * @example
   *  ```markdown
   *  > |   * Start of a comment chunk.
   *          ^
   *  ```
   *
   * @example
   *  ```markdown
   *  > | @module docmark/constructs/comment
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
  function startChunk(this: void, code: Code): State | undefined {
    assert(!eos(code), 'did not expect end of stream')
    assert(!self.concrete, 'did not expect to have concrete subcontent')

    // start new comment chunk after line prefixes.
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
   * @example
   *  ```markdown
   *  > | @module docmark/constructs/comment
   *      ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
   *  ```
   *
   * @example
   *  ```markdown
   *  > |   * Inside comment chunk.
   *          ^^^^^^^^^^^^^^^^^^^^^
   *  ```
   *
   * @example
   *  ```markdown
   *  > | *Consider a sequence `u` where `u` is defined as follows:
   *       ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
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

    // finish comment chunk after line ending.
    if (eol(code)) {
      effects.consume(code)
      effects.exit(tt.chunkComment)
      return ok
    }

    // check for a comment closer sequence
    // before adding an asterisk or whitespace to the chunk.
    if (code === codes.asterisk || whitespace(code)) {
      return effects.check(commentCloser, beforeCloser, addToChunk)(code)
    }

    // consume code and move onto the next.
    return addToChunk(code)
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

    return effects.attempt(
      commentCloser,
      effects.check(eoc, beforeEnd, beforeEnd)
      /* closer confirmed, no need for failure state. */
    )(code)
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
   *  > |   * @return {State | undefined}␊
   *  > |   *  The next state *\/
   *                             ^
   *  > |␊
   *  ```
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function beforeEnd(this: void, code: Code): State | undefined {
    assert(self.containerState, 'expected `containerState` inside comment')
    self.containerState._closeFlow = true
    return ok(code)
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
  return commentOpenerStart

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
  function commentOpenerStart(this: void, code: Code): State | undefined {
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
   * > 👉 **Note**: `␊` represents a line ending and `␠` represents a space.
   *
   * @example
   *  ```markdown
   *  > |/**␊
   *       ^
   *  ```
   *
   * @example
   *  ```markdown
   *  > |/**␠
   *       ^
   *  ```
   *
   * @example
   *  ```markdown
   *  > |/** a
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

    return effects.attempt(
      lineSuffix,
      ok,
      factorySpace(effects, ok, tt.commentLinePadding, 2)
    )
  }
}

/**
 * Tokenize a comment closer.
 *
 * One leading whitespace character may be recognized separately as comment line
 * padding before attempting the closing marker.
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
  return factorySpace(effects, commentCloserStart, tt.commentLinePadding, 2)

  /**
   * Attempt to begin a comment closer.
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
  function commentCloserStart(this: void, code: Code): State | undefined {
    if (code !== codes.asterisk) return nok(code)
    return effects.enter(tt.commentCloser), effects.consume(code), afterAsterisk
  }

  /**
   * Finish a comment closer.
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

/**
 * Tokenize a comment line prefix.
 *
 * Leading padding, an optional line marker (`*`), and padding following the
 * marker are captured and thereby from normalized comment content.
 *
 * Indentation following the prefix is delegated to {@linkcode linePrefix}.
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
  return commentLinePrefixStart

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
  function commentLinePrefixStart(this: void, code: Code): State | undefined {
    effects.enter(tt.commentLinePrefix)

    // capture line padding, then check for comment closer.
    // if no closer, check for marker. otherwise, finish prefix.
    return factorySpace(
      effects,
      effects.check(commentCloser, atLinePrefix, commentLineMarker),
      tt.commentLinePadding
    )(code)
  }

  /**
   * Consume a comment line marker.
   *
   * A line marker consists of one asterisk (`*`). Optional padding following
   * the marker is included in the surrounding `commentLinePrefix` token.
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
    if (code !== codes.asterisk) return nok(code)

    effects.enter(tt.commentLineMarker)
    effects.consume(code)
    effects.exit(tt.commentLineMarker)

    return factorySpace(effects, atLinePrefix, tt.commentLinePadding, 2)
  }

  /**
   * Finish a comment line prefix.
   *
   * Empty prefixes produced while checking an unpadded closer are rejected.
   * Otherwise, indentation following the prefix is considered a general line
   * prefix.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function atLinePrefix(this: void, code: Code): State | undefined {
    /**
     * The comment line prefix token.
     *
     * @const {Token} token
     */
    const token: Token = effects.exit(tt.commentLinePrefix)

    // an unpadded closer can produce an empty tentative prefix.
    if (
      token.start.line === token.end.line &&
      token.start.column === token.end.column &&
      token.start.offset === token.end.offset
    ) {
      return nok(code)
    }

    // capture markdown line prefix.
    // comment chunks are expected to not include line prefixes.
    return effects.attempt(linePrefix, ok, ok)(code)
  }
}

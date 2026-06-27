/**
 * @file Constructs - comment
 * @module docmark/constructs/comment
 */

import { codes, constants, tt } from '@flex-development/docmark-util-symbol'
import type {
  Code,
  Construct,
  Effects,
  State,
  Token,
  TokenizeContext
} from '@flex-development/docmark-util-types'
import { eos } from '@flex-development/mark-parser'
import { ok as assert } from 'devlop'
import { markdownLineEnding, markdownSpace } from 'micromark-util-character'
import commentCloser from './comment-closer.mts'
import commentLinePrefix from './comment-line-prefix.mts'
import commentOpener from './comment-opener.mts'
import tagName from './tag-name.mts'

/**
 * The comment construct.
 *
 * @const {Construct} comment
 */
const comment: Construct = {
  previous: previousComment,
  tokenize: tokenizeComment
}

export default comment

/**
 * Check if `code` can precede a comment.
 *
 * @this {TokenizeContext}
 *
 * @param {Code} code
 *  The previous character code
 * @return {boolean}
 *  `true` if `code` is not {@linkcode codes.backslash}, `false` otherwise
 */
function previousComment(this: TokenizeContext, code: Code): boolean {
  return code !== codes.backslash
}

/**
 * Tokenize a comment.
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

  /**
   * The comment chunk tokenization context.
   *
   * @var {TokenizeContext | undefined} child
   */
  let child: TokenizeContext | undefined

  /**
   * The previous chunk token.
   *
   * @var {Token | undefined} token
   */
  let previous: Token | undefined

  return comment

  /**
   * At the start of a comment.
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
  function comment(this: void, code: Code): State | undefined {
    assert(code === codes.slash, 'expected `codes.slash`')

    // start new comment.
    effects.enter(tt.comment)

    // check for comment opener, then move onto next code.
    return effects.attempt(commentOpener, afterOpener, nok)(code)
  }

  /**
   * After comment opener.
   *
   * If the next code is a line ending, the comment is treated as multiline.
   * Otherwise, it is treated as single-line until a line ending is encountered.
   *
   * @example
   *  ```markdown
   *  > | /**
   *         ^
   *  ```
   *
   * @example
   *  ```markdown
   *  > | /** Location utility.
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
    // check for a comment closer, or a comment closer preceded by a space.
    // note: check performed on known start codes for performance.
    if (code === codes.asterisk || markdownSpace(code)) {
      // end comment after closer, or start comment line chunk.
      return effects.attempt(commentCloser, endComment, startChunk)(code)
    }

    // capture first line ending.
    // if line ending is handled by micromark, it will be considered a blank
    // line even though the comment opener is on this line.
    if (markdownLineEnding(code)) {
      effects.enter(tt.lineEnding)
      effects.consume(code)
      effects.exit(tt.lineEnding)
      return lineStart
    }

    // comment line chunk starts on the same line as opener.
    return startChunk(code)
  }

  /**
   * At the end of a comment.
   *
   * @example
   *  ```markdown
   *  > | *\/
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
  function endComment(this: void, code: Code): State | undefined {
    return effects.exit(tt.comment), ok(code)
  }

  /**
   * Start of a comment line.
   *
   * @example
   *  ```markdown
   *  > |   * Start of a comment line.
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
  function lineStart(this: void, code: Code): State | undefined {
    assert(markdownLineEnding(self.previous), 'expected eol')

    // try capturing comment line prefix.
    // the comment line prefix attempt only fails if a comment line marker is
    // missing, but can succeed and end before a comment closer as well.
    // on success, the comment closer is checked for in the next state.
    // on failure, the comment chunk can starts at the point of failure instead.
    return effects.attempt(commentLinePrefix, beforeChunk, startChunk)(code)
  }

  /**
   * Before attempting a comment chunk.
   *
   * @example
   *  ```markdown
   *  > |   * Before a comment chunk.
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
    // end after comment closer, or continue on to start comment chunk.
    return effects.attempt(commentCloser, endComment, startChunk)(code)
  }

  /**
   * Start of a comment chunk.
   *
   * @example
   *  ```markdown
   *  > |   * Start of a comment chunk.
   *          ^
   *  ```
   *
   * @example
   *  ```markdown
   *  > | /** Location utility.
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
    if (eos(code)) return endComment(code)

    // start new comment chunk tokenizer at current point in comment.
    child ??= self.parser.comment(self.now())

    /**
     * The comment chunk token.
     *
     * @const {Token} token
     */
    const token: Token = effects.enter(tt.chunkComment, {
      _tokenizer: child,
      contentType: constants.contentTypeComment,
      previous
    })

    if (previous) previous.next = token
    previous = token

    return effects.check(tagName, summaryNotAllowed, summaryAllowed)(code)
  }

  /**
   * At the beginning of a comment chunk,
   * after confirming there is no block tag.
   *
   * @example
   *  ```markdown
   *  > | * @this {void}
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
  function summaryAllowed(this: void, code: Code): State | undefined {
    assert(child, 'expected `child` tokenizer')
    child.summaryAllowed = true
    return insideChunk(code)
  }

  /**
   * At the beginning of a comment chunk, after confirming a block tag.
   *
   * @example
   *  ```markdown
   *  > | * Consider a sequence `u` where `u` is defined as follows:
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
  function summaryNotAllowed(this: void, code: Code): State | undefined {
    assert(child, 'expected `child` tokenizer')
    child.summaryAllowed = false
    return insideChunk(code)
  }

  /**
   * Inside comment chunk.
   *
   * @example
   *  ```markdown
   *  > | * Consider a sequence `u` where `u` is defined as follows:
   *        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
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
    if (eos(code)) { // comment without a closer.
      effects.exit(tt.chunkComment)
      return endComment(code)
    }

    // check for a comment closer, or a comment closer preceded by a space.
    // note: check performed on known start codes for performance.
    if (code === codes.asterisk || markdownSpace(code)) {
      return effects.check(
        commentCloser,
        beforeChunkCloser,
        afterCloserCheck
      )(code)
    }

    // restart chunk after line ending.
    if (markdownLineEnding(code)) {
      effects.consume(code)
      effects.exit(tt.chunkComment)
      return lineStart
    }

    // consume code and move onto the next.
    return effects.consume(code), insideChunk
  }

  /**
   * At the end of a comment chunk, before a confirmed comment closer.
   *
   * @example
   *  ```markdown
   *  > | *\/
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
  function beforeChunkCloser(this: void, code: Code): State | undefined {
    effects.exit(tt.chunkComment)

    // closer confirmed, so need for failure state.
    return effects.attempt(commentCloser, endComment)(code)
  }

  /**
   * Inside a comment chunk, after checking for a comment closer.
   *
   * @example
   *  ```markdown
   *  > | * a *b*
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
  function afterCloserCheck(this: void, code: Code): State | undefined {
    // consume code as part of markdown chunk.
    return effects.consume(code), insideChunk
  }
}

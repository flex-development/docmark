/**
 * @file Constructs - summary
 * @module docmark/constructs/summary
 */

import { codes, constants, ct, tt } from '@flex-development/docmark-util-symbol'
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
import { markdownLineEnding } from 'micromark-util-character'
import blockTagStart from './block-tag-start.mts'

/**
 * The comment summary construct.
 *
 * @const {Construct} summary
 */
const summary: Construct = { tokenize: tokenizeSummary }

export default summary

/**
 * Tokenize a comment summary.
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
function tokenizeSummary(
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
   * The previous chunk token.
   *
   * @var {Token | undefined} token
   */
  let previous: Token | undefined

  return summary

  /**
   * At the beginning of a comment summary.
   *
   * @example
   *  ```markdown
   *  > |  /**
   *  > |   * At the beginning of a comment summary.
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
  function summary(this: void, code: Code): State | undefined {
    // summary not allowed here, or end-of-content.
    if (!self.summaryAllowed || eos(code)) return nok(code)

    // start summary.
    effects.enter(tt.summary)

    // fail before block tag start, or start markdown chunk.
    return effects.check(blockTagStart, failBeforeTag, startChunk)(code)
  }

  /**
   * Fail before the start of a block tag.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function failBeforeTag(this: void, code: Code): State | undefined {
    self.summaryAllowed = false
    return nok(code)
  }

  /**
   * Before starting a markdown chunk.
   *
   * @example
   *  ```markdown
   *  > | * The current position in {@linkcode document}.
   *        ^
   *  > | * @todo
   *        ^
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
  function beforeChunk(this: void, code: Code): State | undefined {
    // end summary before block tag, or start markdown chunk.
    return effects.check(blockTagStart, endSummary, startChunk)(code)
  }

  /**
   * At the beginning of a markdown chunk.
   *
   * @example
   *  ```markdown
   *  > | * Consider a sequence `u` where `u` is defined as follows:
   *        ^
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
    /**
     * The markdown chunk token.
     *
     * @const {Token} token
     */
    const token: Token = effects.enter(tt.chunkMarkdown, {
      contentType: constants.contentTypeDocument,
      previous
    })

    if (previous) previous.next = token
    previous = token

    return insideChunk(code)
  }

  /**
   * Inside markdown chunk.
   *
   * @example
   *  ```markdown
   *  > | * Consider a sequence `u` where `u` is defined as follows:
   *        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
   *  ```
   *
   * @example
   *  ```markdown
   *  > | * has certain effects.
   *        ^^^^^^^^^^^^^^^^^^^^
   *  > | *
   *  > | * @see {@linkcode Code}
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
    // end chunk before content's end.
    if (eos(code)) return endChunk(code)

    // end before block tag on new line or start new line.
    if (markdownLineEnding(code)) {
      return effects.check(blockTagStart, endBeforeNewLine, restartChunk)(code)
    }

    // consume code that cannot start a block tag, then move onto next code.
    if (code !== codes.at) return effects.consume(code), insideChunk

    // check for a block tag.
    // end chunk and summary before block tag or move onto next code.
    return effects.check(blockTagStart, endBeforeTag, afterTagCheck)(code)
  }

  /**
   * End the summary before a line ending.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function endBeforeNewLine(this: void, code: Code): State | undefined {
    assert(markdownLineEnding(code), 'expected eol')

    effects.exit(tt.chunkMarkdown)
    effects.exit(tt.summary)
    self.summaryAllowed = false

    /**
     * The final markdown chunk token.
     *
     * @const {Token} token
     */
    const token: Token = effects.enter(tt.chunkMarkdown, {
      contentType: ct.document,
      previous
    })

    assert(previous, 'expected `previous` token')
    previous.next = token
    previous = undefined

    effects.consume(code)
    effects.exit(tt.chunkMarkdown)

    return ok
  }

  /**
   * End the current markdown chunk, and start a new one.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function restartChunk(this: void, code: Code): State | undefined {
    effects.consume(code)
    effects.exit(tt.chunkMarkdown)
    return beforeChunk
  }

  /**
   * At the end of a markdown chunk, before a block tag.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function endBeforeTag(this: void, code: Code): State | undefined {
    self.summaryAllowed = false
    return endChunk(code)
  }

  /**
   * At the end of a markdown chunk, before a block tag or end-of-content.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function endChunk(this: void, code: Code): State | undefined {
    effects.exit(tt.chunkMarkdown)
    return endSummary(code)
  }

  /**
   * Inside a markdown chunk, after checking for a block tag.
   *
   * @example
   *  ```markdown
   *  > | * {@linkcode Code}
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
  function afterTagCheck(this: void, code: Code): State | undefined {
    return effects.consume(code), insideChunk
  }

  /**
   * At the end of a comment summary.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function endSummary(this: void, code: Code): State | undefined {
    self.summaryAllowed = false
    effects.exit(tt.summary)
    return ok(code)
  }
}

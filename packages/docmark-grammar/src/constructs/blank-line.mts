/**
 * @file Constructs - blankLine
 * @module docmark-grammar/constructs/blankLine
 */

import { factorySpace } from '@flex-development/docmark-factory-space'
import { constants, ev, tt } from '@flex-development/docmark-util-symbol'
import type {
  Code,
  Effects,
  Event,
  PartialConstruct,
  State,
  TokenizeContext,
  TokenType
} from '@flex-development/docmark-util-types'
import {
  bos,
  eol,
  eos,
  whitespace
} from '@flex-development/mark-util-character'

/**
 * The blank line construct.
 *
 * A blank line may start at the beginning of stream or after a new line.
 *
 * At the `source` content level, blank lines are considered opaque content when
 * there is no active comment.\
 * Otherwise, leading whitespace is a captured as a `linePrefix`.
 *
 * This construct is expected to run at the `comment` or `source` content level.
 *
 * @category
 *  constructs
 *
 * @const {PartialConstruct} blankLine
 */
const blankLine: PartialConstruct = {
  partial: true,
  previous: previousBlankLine,
  tokenize: tokenizeBlankLine
}

export default blankLine

/**
 * Check whether a blank line may begin after `code`.
 *
 * A blank line may start at the beginning of stream, after a new line,
 * or after a `commentLinePrefix` `exit` event.
 *
 * @this {TokenizeContext}
 *
 * @param {Code} code
 *  The previous character code
 * @return {boolean}
 *  Whether a blank line may begin after `code`
 */
function previousBlankLine(this: TokenizeContext, code: Code): boolean {
  if (bos(code) || eol(code)) return true // beginning of stream or line.

  /**
   * The last emitted event.
   *
   * @const {Event | undefined} tail
   */
  const tail: Event | undefined = this.events[this.events.length - 1]

  // closed comment line prefix.
  return !!tail && tail[0] === ev.exit && tail[1].type === tt.commentLinePrefix
}

/**
 * Tokenize a blank line.
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
function tokenizeBlankLine(
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

  return startBlankLine

  /**
   * At the beginning of a blank line.
   *
   * > 👉 **Note**: `␊` represents a line ending.
   *
   * @example
   *  ```markdown
   *  > | The tokenization context.␠␠␠␊
   *  > |␠␊
   *     ^
   *  > | @const {TokenizeContext} self␊
   *  ```
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function startBlankLine(this: void, code: Code): State | undefined {
    // no whitespace.
    // check for line ending or end of stream.
    if (!whitespace(code)) return afterLinePrefix(code)

    /**
     * The token type to capture whitespace as.
     *
     * When parsing `source` content outside of a comment, blank lines are
     * considered opaque content.\
     * Otherwise, leading whitespace is captured as a `linePrefix`.
     *
     * @const {TokenType | undefined} type
     */
    const type: TokenType | undefined =
      // not parsing `source` content.
      self.contentType !== constants.contentTypeSource ||
        // parsing `source` content, but a comment is active.
        self.containerState?.comment
        ? tt.linePrefix
        : undefined

    return factorySpace(effects, afterLinePrefix, type)(code)
  }

  /**
   * At eos/eol, after optional whitespace.
   *
   * > 👉 **Note**: `␊` represents a line ending.
   *
   * @example
   *  ```markdown
   *  > | * Tokenize a blank line.␊
   *  > | *␊
   *       ^
   *  > | * @this {TokenizeContext}
   *  ```
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function afterLinePrefix(this: void, code: Code): State | undefined {
    // confirmed blank line.
    // at a line ending or end of stream.
    if (eol(code) || eos(code)) return ok(code)

    // not a blank line.
    // this line has content on it.
    return nok(code)
  }
}

/**
 * @file Constructs - linePrefix
 * @module docmark/constructs/linePrefix
 */

import { constants, ev, tt } from '@flex-development/docmark-util-symbol'
import type {
  Code,
  Effects,
  Event,
  PartialConstruct,
  State,
  TokenizeContext
} from '@flex-development/docmark-util-types'
import { eol, whitespace } from '@flex-development/mark-util-character'
import { ok as assert } from 'devlop'

/**
 * The line prefix construct.
 *
 * A line prefix consists of whitespace at the beginning of a logical comment
 * line. The prefix is captured unless doing so would consume indentation
 * reserved for indented code.
 *
 * @const {PartialConstruct} linePrefix
 */
const linePrefix: PartialConstruct = {
  partial: true,
  tokenize: tokenizeLinePrefix
}

export default linePrefix

/**
 * Tokenize a line prefix.
 *
 * Leading whitespace is accepted only at the beginning of a comment line.
 * When indented code is enabled, prefixes as wide as an indented-code marker
 * are rejected so their whitespace remains available to markdown tokenizers.
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
function tokenizeLinePrefix(
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
   * The number of whitespace characters consumed for the possible line prefix.
   *
   * @var {number} size
   */
  let size: number = 0

  return linePrefixStart

  /**
   * Attempt to begin a line prefix.
   *
   * A line prefix may begin only at the start of a comment line: either
   * immediately after a line ending or after a completed `commentLinePrefix`.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function linePrefixStart(this: void, code: Code): State | undefined {
    if (!whitespace(code)) return nok(code)

    /**
     * The last emitted event.
     *
     * @const {Event | undefined} last
     */
    const last: Event | undefined = self.events.at(-1)

    assert(
      last && last[0] === ev.exit && last[1].type === tt.commentLinePrefix ||
        eol(self.previous),
      'expected `commentLinePrefix` `exit` event or beginning of line'
    )

    effects.enter(tt.linePrefix)
    return insideLinePrefix(code)
  }

  /**
   * Continue a possible line prefix.
   *
   * Whitespace is consumed until the first non-whitespace character code.
   *
   * If indented code is disabled, the entire prefix is accepted.
   * Otherwise, prefixes containing fewer than {@linkcode constants.tabSize}
   * whitespace characters are accepted, while larger prefixes are rejected so
   * their whitespace remains available to markdown tokenizers.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function insideLinePrefix(this: void, code: Code): State | undefined {
    if (whitespace(code)) return ++size, effects.consume(code), insideLinePrefix

    effects.exit(tt.linePrefix)
    assert(self.parser.constructs.disable.null, 'expected `disable.null`')

    // when indented code is disabled, the entire line prefix can be removed.
    // otherwise preserve indentation recognized as indented code marker.
    if (
      self.parser.constructs.disable.null.includes('codeIndented') ||
      size < constants.tabSize
    ) {
      return ok(code)
    }

    return nok(code)
  }
}

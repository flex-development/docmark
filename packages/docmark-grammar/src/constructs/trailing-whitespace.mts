/**
 * @file Constructs - trailingWhitespace
 * @module docmark-grammar/constructs/trailingWhitespace
 */

import { factorySpace } from '@flex-development/docmark-factory-space'
import { tt } from '@flex-development/docmark-util-symbol'
import type {
  Code,
  Effects,
  PartialConstruct,
  State,
  TokenizeContext
} from '@flex-development/docmark-util-types'
import { eol, eos, whitespace } from '@flex-development/mark-util-character'
import { ok as assert } from 'devlop'

/**
 * The trailing whitespace construct.
 *
 * Trailing whitespace may be seen at the end of a line.
 *
 * > 👉 **Note**: Blank lines are expected to already be parsed.\
 * > The construct does not check for blank lines before parse attempts.
 *
 * @category
 *  constructs
 *
 * @const {PartialConstruct} trailingWhitespace
 */
const trailingWhitespace: PartialConstruct = {
  partial: true,
  tokenize: tokenizeTrailingWhitespace
}

export default trailingWhitespace

/**
 * Tokenize trailing whitespace.
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
function tokenizeTrailingWhitespace(
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

  return whitespaceTrail

  /**
   * Attempt to begin trailing whitespace.
   *
   * > 👉 **Note**: `␊` represents a line ending and `␠` represents a space.
   *
   * @example
   *  ```markdown
   *  > | The tokenization context.␠␠␠␊
   *                               ^
   *  > |␠␊
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
  function whitespaceTrail(this: void, code: Code): State | undefined {
    assert(!self.parser.atBlankLine, 'did not expect blank line')
    assert(whitespace(code), 'expected whitespace')
    return factorySpace(effects, afterWhitespaceTrail, tt.whitespace)(code)
  }

  /**
   * Finish trailing whitespace.
   *
   * Trailing whitespace is recognized only when the consumed whitespace is
   * immediately followed by a line ending or end of stream.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function afterWhitespaceTrail(this: void, code: Code): State | undefined {
    // mark trailing whitespace.
    self.events.at(-1)![1]._trailing = true

    // capture line ending.
    if (eol(code)) {
      effects.enter(tt.lineEnding)
      effects.consume(code)
      effects.exit(tt.lineEnding)
      return ok
    }

    if (eos(code)) return ok(code) // at end of stream.
    return nok(code)
  }
}

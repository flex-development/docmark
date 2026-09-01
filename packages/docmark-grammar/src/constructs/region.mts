/**
 * @file Constructs - region
 * @module docmark-grammar/constructs/region
 */

import { factorySpace } from '@flex-development/docmark-factory-space'
import { constants, tt } from '@flex-development/docmark-util-symbol'
import type {
  Code,
  Effects,
  PartialConstruct,
  State,
  TokenizeContext
} from '@flex-development/docmark-util-types'
import { bos, eol, eos } from '@flex-development/mark-util-character'
import { ok as assert } from 'devlop'

/**
 * Attempt a comment region at the current position.
 *
 * An unprefixed region attempt is made first.\
 * If the initial attempt fails, a line prefix is then attempted and regions are
 * checked again at the new position, or the current position if no line prefix
 * is present.
 *
 * The construct fails without consuming any input if no prefixed or unprefixed
 * region can begin.
 *
 * Constructs registered for the `comment` content type are then attempted
 * in extension order.
 *
 * @category
 *  constructs
 *
 * @const {PartialConstruct} region
 */
const region: PartialConstruct = { partial: true, tokenize: tokenizeRegion }

export default region

/**
 * Attempt a registered comment region.
 *
 * An unprefixed region attempt is made first.
 *
 * If the initial attempt fails, a line prefix is then attempted and regions are
 * checked again at the new position, or the current position if no line prefix
 * is present.
 *
 * The construct fails without consuming any input if no prefixed or unprefixed
 * region can begin.
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
function tokenizeRegion(
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

  return effects.attempt(this.parser.constructs.comment, ok, prefixedRegion)

  /**
   * Attempt a prefixed comment region.
   *
   * A line prefix is consumed before the region attempt.
   * If a region cannot be entered, the construct fails without consuming input.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function prefixedRegion(this: void, code: Code): State | undefined {
    assert(self.parser.constructs.disable.null, 'expected `disable.null`')

    assert(
      eos(code) || bos(self.previous) || eol(self.previous),
      'expected end of stream, beginning of stream, or beginning of line'
    )

    return factorySpace(
      effects,
      effects.attempt(self.parser.constructs.comment, ok, nok),
      tt.linePrefix,
      self.parser.constructs.disable.null.includes(tt.codeIndented)
        ? undefined
        : constants.tabSize
    )(code)
  }
}

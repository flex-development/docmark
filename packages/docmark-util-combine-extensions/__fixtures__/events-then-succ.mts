/**
 * @file Fixtures - eventsThenSucc
 * @module docmark-util-combine-extensions/fixtures/eventsThenSucc
 */

import { codes, tt } from '@flex-development/docmark-util-symbol'
import type {
  Code,
  Effects,
  NamedConstruct,
  State,
  TokenizeContext
} from '@flex-development/docmark-util-types'

/**
 * A construct that produces a single event pack and then succeeds.
 *
 * @const {NamedConstruct} eventsThenSucc
 */
const eventsThenSucc: NamedConstruct = {
  name: 'eventsThenSucc',
  tokenize: tokenizeEventsThenSucc
}

export default eventsThenSucc

/**
 * @this {TokenizeContext}
 *
 * @param {Effects} effects
 *  The context object to transition the state machine
 * @param {State} ok
 *  The successful tokenization state
 * @return {State}
 *  The initial state
 */
function tokenizeEventsThenSucc(
  this: TokenizeContext,
  effects: Effects,
  ok: State
): State {
  /**
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  return function eventsThenSucc(this: void, code: Code): State | undefined {
    if (code === codes.eos) return effects.consume(code), ok

    effects.enter(tt.data)
    effects.consume(code)
    effects.exit(tt.data)

    return ok
  }
}

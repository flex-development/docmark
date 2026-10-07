/**
 * @file Constructs - nullExpression
 * @module examples/jaymark/constructs/nullExpression
 */

import { factoryMarkers } from '@flex-development/docmark-factory-markers'
import { codes } from '@flex-development/docmark-util-symbol'
import type {
  Code,
  Construct,
  Effects,
  State,
  TokenizeContext
} from '@flex-development/docmark-util-types'
import jt from '../jt.mts'

/**
 * The `null` expression construct.
 *
 * @const {Construct} nullExpression
 */
const nullExpression: Construct = { tokenize: tokenizeNullExpression }

export default nullExpression

/**
 * Tokenize the value `null`.
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
function tokenizeNullExpression(
  this: TokenizeContext,
  effects: Effects,
  ok: State,
  nok: State
): State {
  return startNull

  /**
   * Start a `null` expression.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function startNull(this: void, code: Code): State | undefined {
    effects.enter(jt.nullExpression)
    return tryNull(code)
  }

  /**
   * Try capturing the value `null`.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function tryNull(this: void, code: Code): State | undefined {
    return factoryMarkers(effects, endNull, nok, [
      { code: codes.lowercaseN, type: null },
      { code: codes.lowercaseU, type: null },
      { code: codes.lowercaseL, type: null },
      { code: codes.lowercaseL, type: null }
    ])(code)
  }

  /**
   * End the `null` expression.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function endNull(this: void, code: Code): State | undefined {
    return effects.exit(jt.nullExpression), ok(code)
  }
}

/**
 * @file Constructs - booleanExpression
 * @module examples/jaymark/constructs/booleanExpression
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
 * The boolean expression construct.
 *
 * @const {Construct} booleanExpression
 */
const booleanExpression: Construct = { tokenize: tokenizeBooleanExpression }

export default booleanExpression

/**
 * Tokenize a boolean expression.
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
function tokenizeBooleanExpression(
  this: TokenizeContext,
  effects: Effects,
  ok: State,
  nok: State
): State {
  return startBoolean

  /**
   * Start a boolean expression.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function startBoolean(this: void, code: Code): State | undefined {
    effects.enter(jt.booleanExpression)
    return tryFalse(code)
  }

  /**
   * Try capturing the value `false`.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function tryFalse(this: void, code: Code): State | undefined {
    return factoryMarkers(effects, endBoolean, tryTrue, [
      { code: codes.lowercaseF, type: null },
      { code: codes.lowercaseA, type: null },
      { code: codes.lowercaseL, type: null },
      { code: codes.lowercaseS, type: null },
      { code: codes.lowercaseE, type: null }
    ])(code)
  }

  /**
   * Try capturing the value `true`.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function tryTrue(this: void, code: Code): State | undefined {
    return factoryMarkers(effects, endBoolean, nok, [
      { code: codes.lowercaseT, type: null },
      { code: codes.lowercaseR, type: null },
      { code: codes.lowercaseU, type: null },
      { code: codes.lowercaseE, type: null }
    ])(code)
  }

  /**
   * End a boolean expression.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function endBoolean(this: void, code: Code): State | undefined {
    return effects.exit(jt.booleanExpression), ok(code)
  }
}

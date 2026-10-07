/**
 * @file Constructs - arrayExpression
 * @module examples/jaymark/constructs/arrayExpression
 */

import { codes } from '@flex-development/docmark-util-symbol'
import type {
  Code,
  ContinuableConstruct,
  Effects,
  PartialConstruct,
  State,
  TokenizeContext
} from '@flex-development/docmark-util-types'
import { eos } from '@flex-development/mark-util-character'
import { ok as assert } from 'devlop'
import jt from '../jt.mts'

/**
 * The array expression construct.
 *
 * @const {ContinuableConstruct} arrayExpression
 */
const arrayExpression: ContinuableConstruct = {
  continuation: { tokenize: tokenizeArrayExpressionContinuation },
  exit: exitArrayExpression,
  tokenize: tokenizeArrayExpression
}

export default arrayExpression

/**
 * The array expression closer construct.
 *
 * @const {PartialConstruct} arrayExpressionCloser
 */
const arrayExpressionCloser: PartialConstruct = {
  partial: true,
  tokenize: tokenizeArrayExpressionCloser
}

/**
 * Exit an array expression.
 *
 * @this {TokenizeContext}
 *
 * @param {Effects} effects
 *  The context object used to transition the state machine
 * @return {undefined}
 */
function exitArrayExpression(
  this: TokenizeContext,
  effects: Effects
): undefined {
  return void effects.exit(jt.arrayExpression)
}

/**
 * Tokenize an array expression.
 *
 * @this {TokenizeContext}
 *
 * @param {Effects} effects
 *  The context object used to transition the state machine
 * @param {State} ok
 *  The successful tokenization state
 * @return {State}
 *  The initial state
 */
function tokenizeArrayExpression(
  this: TokenizeContext,
  effects: Effects,
  ok: State
): State {
  /**
   * The tokenization context.
   *
   * @const {TokenizeContext} self
   */
  const self: TokenizeContext = this

  return startArray

  /**
   * Start an array expression.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function startArray(this: void, code: Code): State | undefined {
    assert(
      code === codes.leftSquareBracket,
      'expected `codes.leftSquareBracket`'
    )

    assert(self.containerState, 'expected `containerState` inside expression')

    // enter the array expression.
    effects.enter(jt.arrayExpression)

    // capture the opening marker.
    effects.enter(jt.arrayMarker, { _open: true })
    effects.consume(code)
    effects.exit(jt.arrayMarker)

    // increase or initialize nesting depth.
    if (self.containerState.arrays) {
      self.containerState.arrays++
    } else {
      self.containerState.arrays = 1
    }

    // try capturing the array expression closer.
    // on success, mark the expression container for closure.
    // if the attempt fails, delegate back to the `language` initializer.
    return effects.attempt(arrayExpressionCloser, closeExpression, ok)
  }

  /**
   * Mark the expression container for closure.
   *
   * Container finalization is deferred to the `language` initializer.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function closeExpression(this: void, code: Code): State | undefined {
    assert(self.containerState, 'expected `containerState` inside expression')
    self.containerState._closeFlow = true
    return ok(code)
  }
}

/**
 * Continue tokenizing an array expression.
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
function tokenizeArrayExpressionContinuation(
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

  return continueArray

  /**
   * Try continuing the current array expression.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function continueArray(this: void, code: Code): State | undefined {
    assert(self.containerState, 'expected `containerState` inside expression')
    assert(self.containerState.arrays, 'expected array nesting depth')

    // at end of stream.
    if (eos(code)) return nok(code)

    // capture a value separator.
    if (code === codes.comma) {
      effects.enter(jt.valueSeparator)
      effects.consume(code)
      effects.exit(jt.valueSeparator)
      return ok
    }

    // try capturing the current array expression closer.
    // on success, mark the expression container for closure.
    // on failure, delegate back to the `source` initializer.
    return effects.attempt(arrayExpressionCloser, closeExpression, ok)(code)
  }

  /**
   * Mark the expression container for closure.
   *
   * Container finalization is deferred to the `language` initializer.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function closeExpression(this: void, code: Code): State | undefined {
    assert(self.containerState, 'expected `containerState` inside expression')
    self.containerState._closeFlow = true
    return ok(code)
  }
}

/**
 * Tokenize an array expression closer.
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
function tokenizeArrayExpressionCloser(
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

  return startArrayCloser

  /**
   * Try capturing an array expression closer.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function startArrayCloser(this: void, code: Code): State | undefined {
    assert(self.containerState, 'expected `containerState` inside expression')
    assert(self.containerState.arrays, 'expected array nesting depth')

    // cannot be a closer.
    if (code !== codes.rightSquareBracket) return nok(code)

    // decrease the current array nesting depth.
    self.containerState.arrays--

    // still inside another array.
    // the array nesting depth has yet to reach zero.
    if (self.containerState.arrays) return nok(code)

    // capture the closing marker.
    // a right square bracket can closes the current array
    // if the current array nesting depth has reached zero.
    effects.enter(jt.arrayMarker, { _close: true })
    effects.consume(code)
    effects.exit(jt.arrayMarker)
    return ok
  }
}

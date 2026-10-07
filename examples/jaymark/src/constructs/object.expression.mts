/**
 * @file Constructs - objectExpression
 * @module examples/jaymark/constructs/objectExpression
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
 * The object expression construct.
 *
 * @const {ContinuableConstruct} objectExpression
 */
const objectExpression: ContinuableConstruct = {
  continuation: { tokenize: tokenizeObjectExpressionContinuation },
  exit: exitObjectExpression,
  tokenize: tokenizeObjectExpression
}

export default objectExpression

/**
 * The object expression closer construct.
 *
 * @const {PartialConstruct} objectExpressionCloser
 */
const objectExpressionCloser: PartialConstruct = {
  partial: true,
  tokenize: tokenizeObjectExpressionCloser
}

/**
 * Exit an object expression.
 *
 * @this {TokenizeContext}
 *
 * @param {Effects} effects
 *  The context object used to transition the state machine
 * @return {undefined}
 */
function exitObjectExpression(
  this: TokenizeContext,
  effects: Effects
): undefined {
  return void effects.exit(jt.objectExpression)
}

/**
 * Tokenize an object expression.
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
function tokenizeObjectExpression(
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

  return startObject

  /**
   * Start an object expression.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function startObject(this: void, code: Code): State | undefined {
    assert(code === codes.leftCurlyBrace, 'expected `codes.leftCurlyBrace`')
    assert(self.containerState, 'expected `containerState` inside expression')

    // start the object expression.
    effects.enter(jt.objectExpression)

    // capture the opening marker.
    effects.enter(jt.objectMarker, { _open: true })
    effects.consume(code)
    effects.exit(jt.objectMarker)

    // increase or initialize nesting depth.
    if (self.containerState.objects) {
      self.containerState.objects++
    } else {
      self.containerState.objects = 1
    }

    // try capturing the object expression closer.
    // on success, mark the expression container for closure.
    // if the attempt fails, delegate back to the `language` initializer.
    return effects.attempt(objectExpressionCloser, closeExpression, ok)
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
 * Continue tokenizing an object expression.
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
function tokenizeObjectExpressionContinuation(
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

  return continueObject

  /**
   * Try continuing the current object expression.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function continueObject(this: void, code: Code): State | undefined {
    assert(self.containerState, 'expected `containerState` inside expression')
    assert(self.containerState.objects, 'expected object nesting depth')

    // at end of stream.
    if (eos(code)) return nok(code)

    // capture a field separator.
    if (code === codes.colon) {
      effects.enter(jt.fieldSeparator)
      effects.consume(code)
      effects.exit(jt.fieldSeparator)
      return ok
    }

    // capture a value separator.
    if (code === codes.comma) {
      effects.enter(jt.valueSeparator)
      effects.consume(code)
      effects.exit(jt.valueSeparator)
      return ok
    }

    // try capturing the current object expression closer.
    // on success, mark the expression container for closure.
    // on failure, delegate back to the `source` initializer.
    return effects.attempt(objectExpressionCloser, closeExpression, ok)(code)
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
 * Tokenize an object expression closer.
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
function tokenizeObjectExpressionCloser(
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

  return startObjectCloser

  /**
   * Try capturing an object expression closer.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function startObjectCloser(this: void, code: Code): State | undefined {
    assert(self.containerState, 'expected `containerState` inside expression')
    assert(self.containerState.objects, 'expected object nesting depth')

    // cannot be a closer.
    if (code !== codes.rightCurlyBrace) return nok(code)

    // decrease the current object nesting depth.
    self.containerState.objects--

    // still inside another object.
    // the object nesting depth has yet to reach zero.
    if (self.containerState.objects) return nok(code)

    // capture the closing marker.
    // a right curly brace can closes the current object
    // if the current object nesting depth has reached zero.
    effects.enter(jt.objectMarker, { _close: true })
    effects.consume(code)
    effects.exit(jt.objectMarker)
    return ok
  }
}

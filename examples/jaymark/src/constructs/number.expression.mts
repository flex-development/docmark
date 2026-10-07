/**
 * @file Constructs - numberExpression
 * @module examples/jaymark/constructs/numberExpression
 */

import { codes } from '@flex-development/docmark-util-symbol'
import type {
  Code,
  Construct,
  Effects,
  PartialConstruct,
  State,
  TokenizeContext
} from '@flex-development/docmark-util-types'
import { asciiDigit, eos } from '@flex-development/mark-util-character'
import { ok as assert } from 'devlop'
import jt from '../jt.mts'

/**
 * The number expression construct.
 *
 * @const {Construct} numberExpression
 */
const numberExpression: Construct = { tokenize: tokenizeNumberExpression }

export default numberExpression

/**
 * The exponential number construct.
 *
 * This construct captures a number with an exponent component.
 *
 * @const {PartialConstruct} exponential
 */
const exponential: PartialConstruct = {
  partial: true,
  tokenize: tokenizeExponential
}

/**
 * The float construct.
 *
 * This construct captures a number with a fractional component.
 *
 * @const {PartialConstruct} float
 */
const float: PartialConstruct = { partial: true, tokenize: tokenizeFloat }

/**
 * The integer construct.
 *
 * This construct captures a non-zero integer component.
 *
 * @const {PartialConstruct} integer
 */
const integer: PartialConstruct = { partial: true, tokenize: tokenizeInteger }

/**
 * Tokenize a number expression.
 *
 * Number expressions are captured by attempting the most specific form first,
 * then falling back to less specific forms.
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
function tokenizeNumberExpression(
  this: TokenizeContext,
  effects: Effects,
  ok: State,
  nok: State
): State {
  return startNumber

  /**
   * Start a new number expression.
   *
   * A number may begin with a sign.
   * The sign is consumed before attempting to capture the number body.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function startNumber(this: void, code: Code): State | undefined {
    effects.enter(jt.numberExpression)

    // signed number.
    // consume the sign, then try capturing an exponential.
    if (sign(code)) return effects.consume(code), tryExponential

    // try capturing an exponential.
    return tryExponential(code)
  }

  /**
   * Try capturing an exponential.
   *
   * Exponential numbers are attempted first because they may contain a float
   * or integer number component followed by an exponent.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function tryExponential(this: void, code: Code): State | undefined {
    return effects.attempt(exponential, endNumber, tryFloat)(code)
  }

  /**
   * Try capturing a float.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function tryFloat(this: void, code: Code): State | undefined {
    return effects.attempt(float, endNumber, tryInteger)(code)
  }

  /**
   * Try capturing an integer.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function tryInteger(this: void, code: Code): State | undefined {
    return effects.attempt(integer, endNumber, tryZero)(code)
  }

  /**
   * Try capturing the number `0`.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function tryZero(this: void, code: Code): State | undefined {
    if (code === codes.digit0) return effects.consume(code), endNumber
    return nok(code)
  }

  /**
   * End the number expression.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function endNumber(this: void, code: Code): State | undefined {
    effects.exit(jt.numberExpression)
    return ok(code)
  }
}

/**
 * Tokenize an exponential number.
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
function tokenizeExponential(
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

  return startExponential

  /**
   * Start an exponential.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function startExponential(this: void, code: Code): State | undefined {
    return effects.attempt(
      float,
      beforeMarker,
      effects.attempt(integer, beforeMarker, maybeZero)
    )(code)
  }

  /**
   * Try capturing the zero number alternative.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function maybeZero(this: void, code: Code): State | undefined {
    if (code === codes.digit0) return effects.consume(code), beforeMarker
    return nok(code)
  }

  /**
   * Try capturing an exponential number marker.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function beforeMarker(this: void, code: Code): State | undefined {
    // consume the marker and try continuing the exponential.
    if (marker(code)) return effects.consume(code), maybeSign

    // cannot be an exponential number.
    return nok(code)
  }

  /**
   * Try capturing an optional exponential sign.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function maybeSign(this: void, code: Code): State | undefined {
    if (sign(code)) return effects.consume(code), afterSign
    return noSign(code)
  }

  /**
   * Capture the digits following an exponential sign.
   *
   * The exponential must contain at least one digit after the sign.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function afterSign(this: void, code: Code): State | undefined {
    // can continue an exponential.
    if (asciiDigit(code)) return effects.consume(code), afterSign

    // an exponential must have at least one digit after the sign marker.
    if (sign(self.previous)) return nok(code)

    // exponential done.
    // at least one digit was seen after the sign marker.
    return ok(code)
  }

  /**
   * Capture the digits following an exponential marker without a sign.
   *
   * The exponential must contain at least one digit after the marker.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function noSign(this: void, code: Code): State | undefined {
    // can continue an exponential.
    if (asciiDigit(code)) return effects.consume(code), noSign

    // an exponential must have at least one digit after the marker.
    if (marker(self.previous)) return nok(code)

    // exponential done.
    // at least one digit was seen after the marker.
    return ok(code)
  }

  /**
   * Check if `code` represents an exponential number marker.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {boolean}
   *  Whether `code` is an exponential number marker
   */
  function marker(this: void, code: Code): boolean {
    return code === codes.uppercaseE || code === codes.lowercaseE
  }
}

/**
 * Tokenize a float.
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
function tokenizeFloat(
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

  return startFloat

  /**
   * Start a float.
   *
   * The integer component must contain at least one digit before the decimal
   * point.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function startFloat(this: void, code: Code): State | undefined {
    // at the beginning of a float.
    if (asciiDigit(code)) return effects.consume(code), beforeDecimalPoint

    // not a float.
    return nok(code)
  }

  /**
   * Capture the integer component of a float.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function beforeDecimalPoint(this: void, code: Code): State | undefined {
    // at decimal point.
    if (code === codes.dot) return atDecimalPoint(code)

    // can continue a float.
    if (asciiDigit(code)) return effects.consume(code), beforeDecimalPoint

    // not a float.
    return nok(code)
  }

  /**
   * Consume the decimal point.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function atDecimalPoint(this: void, code: Code): State | undefined {
    assert(code === codes.dot, 'expected `codes.dot`')
    return effects.consume(code), afterDecimalPoint
  }

  /**
   * Capture the fractional component of a float.
   *
   * The fractional component must contain at least one digit after the decimal
   * point.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function afterDecimalPoint(this: void, code: Code): State | undefined {
    // can continue a float.
    if (asciiDigit(code)) return effects.consume(code), afterDecimalPoint

    // a float must have at least one digit after the separator.
    if (self.previous === codes.dot) return nok(code)

    // float done.
    // at least one digit was seen after the separator.
    return ok(code)
  }
}

/**
 * Tokenize an integer.
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
function tokenizeInteger(
  this: TokenizeContext,
  effects: Effects,
  ok: State,
  nok: State
): State {
  return startInteger

  /**
   * Start an integer.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function startInteger(this: void, code: Code): State | undefined {
    // at end of stream.
    if (eos(code)) return nok(code)

    // cannot start an integer.
    if (code < codes.digit1 || !asciiDigit(code)) return nok(code)

    // at the beginning of an integer.
    return effects.consume(code), insideInteger
  }

  /**
   * Capture the remaining digits of an integer.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function insideInteger(this: void, code: Code): State | undefined {
    // can continue an integer.
    if (asciiDigit(code)) return effects.consume(code), insideInteger

    // integer cannot continue.
    return ok(code)
  }
}

/**
 * Check if `code` represents a signed number marker.
 *
 * @this {void}
 *
 * @param {Code} code
 *  The current character code
 * @return {boolean}
 *  Whether `code` is a signed number marker
 */
function sign(this: void, code: Code): boolean {
  return code === codes.plusSign || code === codes.dash
}

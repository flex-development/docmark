/**
 * @file Constructs - namepath
 * @module docmark/constructs/namepath
 */

import factoryIdentifier from '#tests/utils/factory-identifier'
import { trailingWhitespace } from '@flex-development/docmark-grammar'
import { codes, tt } from '@flex-development/docmark-util-symbol'
import type {
  Code,
  Effects,
  NamedConstruct,
  PartialConstruct,
  State,
  TokenizeContext
} from '@flex-development/docmark-util-types'
import { eol, eos, whitespace } from '@flex-development/mark-util-character'

/**
 * The namepath construct.
 *
 * @const {NamedConstruct & PartialConstruct} namepath
 */
const namepath: NamedConstruct & PartialConstruct = {
  name: tt.namepath,
  partial: true,
  tokenize: tokenizeNamepath
}

export default namepath

/**
 * The namepath segment construct.
 *
 * @const {PartialConstruct} namepathSegment
 */
const namepathSegment: PartialConstruct = {
  partial: true,
  tokenize: tokenizeNamepathSegment
}

/**
 * Check if `code` represents a namepath connector.
 *
 * @this {void}
 *
 * @param {Code} code
 *  The current character code
 * @return {boolean}
 *  Whether `code` represents a connector
 */
function connector(this: void, code: Code): boolean {
  return (
    code === codes.numberSign || // instance member reference.
    code === codes.dot || // static member reference.
    code === codes.tilde // inner member reference.
  )
}

/**
 * Tokenize a namepath.
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
function tokenizeNamepath(
  this: TokenizeContext,
  effects: Effects,
  ok: State,
  nok: State
): State {
  /**
   * Whether the namepath contains optional syntax.
   *
   * @var {boolean} marker
   */
  let marker: boolean

  return startNamepath

  /**
   * At the beginning of a namepath.
   *
   * > 👉 **Note**: `␊` represents a line ending.
   *
   * @example
   *  ```markdown
   *  > |@param {Effects} effects␊
   *                      ^
   *  ```
   *
   * @example
   *  ```markdown
   *  > |@param [options]␊
   *            ^
   *  ```
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function startNamepath(this: void, code: Code): State | undefined {
    effects.enter(tt.namepath)

    if (code !== codes.leftSquareBracket) return firstIdentifier(code)

    marker = true

    effects.enter(tt.namepathMarker, { _open: true })
    effects.consume(code)
    effects.exit(tt.namepathMarker)

    return firstIdentifier
  }

  /**
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function firstIdentifier(this: void, code: Code): State | undefined {
    return factoryIdentifier(
      effects,
      trySegment,
      nok,
      tt.namepathIdentifier
    )(code)
  }

  /**
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function trySegment(this: void, code: Code): State | undefined {
    return effects.attempt(namepathSegment, trySegment, endNamepath)(code)
  }

  /**
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function endNamepath(this: void, code: Code): State | undefined {
    if (marker) {
      if (code !== codes.rightSquareBracket) return nok(code)

      effects.enter(tt.namepathMarker, { _close: true })
      effects.consume(code)
      effects.exit(tt.namepathMarker)

      effects.exit(tt.namepath)
      return afterNamepath
    }

    effects.exit(tt.namepath)
    return afterNamepath(code)
  }

  /**
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function afterNamepath(this: void, code: Code): State | undefined {
    if (whitespace(code)) {
      return effects.check(trailingWhitespace, ok, nok)(code)
    }

    if (eol(code) || eos(code)) return ok(code)
    return nok(code)
  }
}

/**
 * Tokenize a namepath segment.
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
function tokenizeNamepathSegment(
  this: TokenizeContext,
  effects: Effects,
  ok: State,
  nok: State
): State {
  return segment

  /**
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function segment(this: void, code: Code): State | undefined {
    if (!connector(code)) return nok(code)

    effects.enter(tt.namepathConnector)
    effects.consume(code)
    effects.exit(tt.namepathConnector)

    return factoryIdentifier(effects, ok, nok, tt.namepathIdentifier)
  }
}

/**
 * @file Constructs - hashbang
 * @module fixtures/constructs/hashbang
 */

import { codes, tt } from '@flex-development/docmark-util-symbol'
import type {
  Code,
  ContinuableConstruct,
  Effects,
  State,
  TokenizeContext
} from '@flex-development/docmark-util-types'
import { ok as assert } from 'devlop'

/**
 * The hashbang comment construct.
 *
 * @const {ContinuableConstruct} hashbang
 */
const hashbang: ContinuableConstruct = {
  add: 'after',
  continuation: { tokenize: tokenizeHashbangContinuation },
  exit: exitHashbang,
  tokenize: tokenizeHashbang
}

export default hashbang

/**
 * Exit a hashbang comment.
 *
 * @this {TokenizeContext}
 *
 * @param {Effects} effects
 *  The context object to transition the state machine
 * @return {undefined}
 */
function exitHashbang(this: TokenizeContext, effects: Effects): undefined {
  effects.exit(tt.comment)
  return void effects
}

/**
 * Tokenize a hashbang comment.
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
function tokenizeHashbang(
  this: TokenizeContext,
  effects: Effects,
  ok: State,
  nok: State
): State {
  return hashbangStart

  /**
   * At the beginning of a hashbang comment.
   *
   * > 👉 **Note**: `␊` represents a line ending.
   *
   * @example
   *  ```markdown
   *  > |#!/usr/bin/env node␊
   *     ^
   *  ```
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function hashbangStart(this: void, code: Code): State | undefined {
    assert(code === codes.numberSign, 'expected `codes.numberSign`')

    effects.enter(tt.comment, { _container: true })

    effects.enter(tt.commentLineMarker)
    effects.consume(code)

    return afterFirstMarker
  }

  /**
   * After the first comment marker.
   *
   * > 👉 **Note**: `␊` represents a line ending.
   *
   * @example
   *  ```markdown
   *  > |#!/usr/bin/env node␊
   *      ^
   *  ```
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function afterFirstMarker(this: void, code: Code): State | undefined {
    if (code !== codes.exclamationMark) return nok(code)

    effects.consume(code)
    effects.exit(tt.commentLineMarker)

    return ok
  }
}

/**
 * Continue tokenizing a hashbang comment.
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
function tokenizeHashbangContinuation(
  this: TokenizeContext,
  effects: Effects,
  ok: State,
  nok: State
): State {
  return nok
}

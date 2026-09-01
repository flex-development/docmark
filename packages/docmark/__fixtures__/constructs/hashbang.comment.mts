/**
 * @file Constructs - hashbang
 * @module fixtures/constructs/hashbang
 */

import { factorySpace } from '@flex-development/docmark-factory-space'
import { codes, tt } from '@flex-development/docmark-util-symbol'
import type {
  Code,
  ContinuableConstruct,
  Effects,
  NamedConstruct,
  State,
  TokenizeContext
} from '@flex-development/docmark-util-types'
import { bos, eol, eos } from '@flex-development/mark-util-character'
import { ok as assert } from 'devlop'

/**
 * The hashbang comment construct.
 *
 * @const {ContinuableConstruct} hashbang
 */
const hashbang: ContinuableConstruct & NamedConstruct = {
  add: 'after',
  continuation: { tokenize: tokenizeHashbangContinuation },
  exit: exitHashbang,
  name: tt.comment + ':hashbang',
  previous: previousHashbang,
  tokenize: tokenizeHashbang
}

export default hashbang

/**
 * Exit a hashbang comment.
 *
 * @this {TokenizeContext}
 *
 * @param {Effects} effects
 *  The context object used to transition the state machine
 * @return {undefined}
 */
function exitHashbang(this: TokenizeContext, effects: Effects): undefined {
  assert(this.parser.constructs.disable.null, 'expected `disable.null`')
  this.parser.constructs.disable.null.push(hashbang.name)
  return void effects.exit(tt.comment)
}

/**
 * Check if `code` can precede a hashbang comment.
 *
 * @this {TokenizeContext}
 *
 * @param {Code} code
 *  The previous character code
 * @return {boolean}
 *  Whether `code` can precede a hashbang comment
 */
function previousHashbang(this: TokenizeContext, code: Code): boolean {
  return bos(code)
}

/**
 * Tokenize a hashbang comment.
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
function tokenizeHashbang(
  this: TokenizeContext,
  effects: Effects,
  ok: State,
  nok: State
): State {
  return startHashbang

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
  function startHashbang(this: void, code: Code): State | undefined {
    assert(code === codes.numberSign, 'expected `codes.numberSign`')

    effects.enter(tt.comment, { _container: true, _kind: 'hashbang' })

    effects.enter(tt.commentLinePrefix)

    effects.enter(tt.commentLineMarker)
    effects.consume(code)
    effects.exit(tt.commentLineMarker)

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

    effects.enter(tt.commentLineMarker)
    effects.consume(code)
    effects.exit(tt.commentLineMarker)

    effects.exit(tt.commentLinePrefix)

    return factorySpace(effects, startPath, tt.commentPadding)
  }

  /**
   * At the beginning of the interpreter path.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function startPath(this: void, code: Code): State | undefined {
    assert(!eol(code), 'did not expect line ending')
    assert(!eos(code), 'did not expect end of stream')

    effects.enter('interpreterPath')
    return insidePath(code)
  }

  /**
   * Inside the interpreter path.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function insidePath(this: void, code: Code): State | undefined {
    // interpreter path and comment terminated by end of stream.
    // the `source` initializer will handle closing the comment.
    if (eos(code)) {
      effects.exit('interpreterPath')
      return ok(code)
    }

    // finish interpreter path before line ending.
    if (eol(code)) {
      effects.exit('interpreterPath')
      effects.enter(tt.lineEnding)
      effects.consume(code)
      effects.exit(tt.lineEnding)
      return ok
    }

    effects.consume(code)
    return insidePath
  }
}

/**
 * Continue tokenizing a hashbang comment.
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
function tokenizeHashbangContinuation(
  this: TokenizeContext,
  effects: Effects,
  ok: State,
  nok: State
): State {
  return nok
}

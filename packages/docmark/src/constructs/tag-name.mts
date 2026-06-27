/**
 * @file Constructs - tagName
 * @module docmark/constructs/tagName
 */

import { codes, tt } from '@flex-development/docmark-util-symbol'
import type {
  Code,
  Effects,
  PartialConstruct,
  State,
  TokenizeContext
} from '@flex-development/docmark-util-types'

/**
 * The tag name construct.
 *
 * @const {PartialConstruct} tagName
 */
const tagName: PartialConstruct = {
  partial: true,
  previous: previousTagName,
  tokenize: tokenizeTagName
}

export default tagName

/**
 * Check if `code` can precede a tag name.
 *
 * @this {TokenizeContext}
 *
 * @param {Code} code
 *  The previous character code
 * @return {boolean}
 *  If {@linkcode this.currentConstruct} is not `inlineTag`, `true` if `code` is
 *  not {@linkcode codes.backslash} and not {@linkcode codes.leftBrace}.
 *  Otherwise, `true` if `code` ***is*** {@linkcode codes.leftBrace}
 */
function previousTagName(this: TokenizeContext, code: Code): boolean {
  return this.currentConstruct?.name === tt.inlineTag
    ? code === codes.leftBrace
    : code !== codes.backslash && code !== codes.leftBrace
}

/**
 * Tokenize a tag name.
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
function tokenizeTagName(
  this: TokenizeContext,
  effects: Effects,
  ok: State,
  nok: State
): State {
  /**
   * Regular expression matching characters that can continue an identifier.
   *
   * @const {RegExp} ID_Continue
   */
  const ID_Continue: RegExp = /[$\p{ID_Continue}]/u

  /**
   * Regular expression matching characters that can start an identifier.
   *
   * @const {RegExp} ID_Start
   */
  const ID_Start: RegExp = /[$_\p{ID_Start}]/u

  return tagName

  /**
   * Start of tag name, at marker.
   *
   * @example
   *  ```markdown
   *  > | @todo
   *      ^
   *  ```
   *
   * @example
   *  ```markdown
   *  > | {@linkcode State}
   *       ^
   *  ```
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function tagName(this: void, code: Code): State | undefined {
    if (code !== codes.at) return nok(code)

    effects.enter(tt.tagName)

    effects.enter(tt.tagNameMarker)
    effects.consume(code)
    effects.exit(tt.tagNameMarker)

    return afterMarker
  }

  /**
   * Start of tag name identifier, after marker.
   *
   * @example
   *  ```markdown
   *  > | @todo
   *       ^
   *  ```
   *
   * @example
   *  ```markdown
   *  > | {@linkcode State}
   *        ^
   *  ```
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function afterMarker(this: void, code: Code): State | undefined {
    if (
      code !== codes.eos &&
      code >= 0 &&
      ID_Start.test(String.fromCodePoint(code))
    ) {
      effects.enter(tt.tagNameIdentifier)
      effects.consume(code)
      return identifier
    }

    return nok(code)
  }

  /**
   * Inside tag name identifier, after first character.
   *
   * @example
   *  ```markdown
   *  > | @todo
   *        ^^^
   *  ```
   *
   * @example
   *  ```markdown
   *  > | {@linkcode State}
   *         ^^^^^^^
   *  ```
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function identifier(this: void, code: Code): State | undefined {
    if (
      code !== codes.eos &&
      code >= 0 &&
      ID_Continue.test(String.fromCodePoint(code))
    ) {
      effects.consume(code)
      return identifier
    }

    effects.exit(tt.tagNameIdentifier)
    effects.exit(tt.tagName)

    return ok(code)
  }
}

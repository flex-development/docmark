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
import { idContinue, idStart } from '@flex-development/mark-util-character'

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
 *  not {@linkcode codes.backslash} and not {@linkcode codes.leftCurlyBrace}.
 *  Otherwise, `true` if `code` ***is*** {@linkcode codes.leftCurlyBrace}
 */
function previousTagName(this: TokenizeContext, code: Code): boolean {
  return this.currentConstruct?.name === tt.inlineTag
    ? code === codes.leftCurlyBrace
    : code !== codes.backslash && code !== codes.leftCurlyBrace
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
    if (code !== codes.atSign) return nok(code)

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
    if (!idStart(code)) return nok(code)

    effects.enter(tt.tagNameIdentifier)
    effects.consume(code)

    return identifier
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
    if (idContinue(code)) return effects.consume(code), identifier

    effects.exit(tt.tagNameIdentifier)
    effects.exit(tt.tagName)

    return ok(code)
  }
}

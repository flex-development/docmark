/**
 * @file Test Utilities - factoryIdentifier
 * @module tests/utils/factoryIdentifier
 */

import { tt } from '@flex-development/docmark-util-symbol'
import type {
  Code,
  Effects,
  State,
  TokenType
} from '@flex-development/docmark-util-types'
import { idContinue, idStart } from '@flex-development/mark-util-character'

/**
 * Tokenize an identifier.
 *
 * @see {@linkcode Effects}
 * @see {@linkcode State}
 * @see {@linkcode TokenType}
 *
 * @param {Effects} effects
 *  The context object used to transition the state machine
 * @param {State} ok
 *  The successful tokenization state
 * @param {State} nok
 *  The failed tokenization state
 * @param {TokenType | null | undefined} [type]
 *  The token type
 * @return {State}
 *  The initial state
 */
function factoryIdentifier(
  effects: Effects,
  ok: State,
  nok: State,
  type?: TokenType | null | undefined
): State {
  type ??= tt.identifier
  return startIdentifier

  /**
   * At the beginning of an identifier.
   *
   * The first identifier character must satisfy {@linkcode idStart}.
   *
   * > 👉 **Note**: `␊` represents a line ending.
   *
   * @example
   *  ```markdown
   *  > |@internal
   *      ^
   *  ```
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
   *             ^
   *  ```
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function startIdentifier(this: void, code: Code): State | undefined {
    if (!idStart(code)) return nok(code)

    effects.enter(type!)
    effects.consume(code)

    return continueIdentifier
  }

  /**
   * Inside the identifier, after its first character.
   *
   * Identifier-continue characters are consumed until the first character that
   * does not satisfy {@linkcode idContinue}.
   * The identifier is then closed and tokenization succeeds without consuming
   * the current character.
   *
   * > 👉 **Note**: `␊` represents a line ending.
   *
   * @example
   *  ```markdown
   *  > |@internal
   *      ^^^^^^^^
   *  ```
   *
   * @example
   *  ```markdown
   *  > |@param {Effects} effects␊
   *                      ^^^^^^^
   *  ```
   *
   * @example
   *  ```markdown
   *  > |@param [options]␊
   *             ^^^^^^^
   *  ```
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function continueIdentifier(this: void, code: Code): State | undefined {
    if (idContinue(code)) return effects.consume(code), continueIdentifier
    effects.exit(type!)
    return ok(code)
  }
}

export default factoryIdentifier

/**
 * @file Constructs - typeExpressionValue
 * @module docmark-grammar/constructs/typeExpressionValue
 */

import { tt } from '@flex-development/docmark-util-symbol'
import type {
  Code,
  Effects,
  NamedConstruct,
  PartialConstruct,
  State,
  TokenizeContext
} from '@flex-development/docmark-util-types'
import { eos } from '@flex-development/mark-util-character'

/**
 * The type expression value construct.
 *
 * A type expression value represents the contents of a value within a type
 * expression. The value is preserved as-is until the end of the current `type`
 * content stream.
 *
 * This construct is expected to run at the `type` content level.
 *
 * It is `partial` so the enclosing type construct remains the tokenizer's
 * `currentConstruct` while the value is parsed.
 *
 * @const {NamedConstruct & PartialConstruct} typeExpressionValue
 */
const typeExpressionValue: NamedConstruct & PartialConstruct = {
  add: 'after',
  name: tt.typeExpressionValue,
  partial: true,
  tokenize: tokenizeTypeExpressionValue
}

export default typeExpressionValue

/**
 * Tokenize a type expression value.
 *
 * The value begins at the current position and consumes content until the
 * current `type` content stream reaches end of stream.
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
function tokenizeTypeExpressionValue(
  this: TokenizeContext,
  effects: Effects,
  ok: State
): State {
  return startTypeExpressionValue

  /**
   * Start a type expression value.
   *
   * The value container is opened before its content is consumed.
   *
   * > 👉 **Note**: `␊` represents a line ending.
   *
   * @example
   *  ```markdown
   *  > |@return {State | undefined}␊
   *              ^
   *  ```
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function startTypeExpressionValue(this: void, code: Code): State | undefined {
    effects.enter(tt.typeExpressionValue) // enter the value container.
    return insideValue(code) // consume until the stream ends.
  }

  /**
   * Inside a type expression value.
   *
   * Content remains part of the value until end of stream.
   *
   * > 👉 **Note**: `␊` represents a line ending.
   *
   * @example
   *  ```markdown
   *  > |@return {State | undefined}␊
   *              ^^^^^^^^^^^^^^^^^
   *  ```
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function insideValue(this: void, code: Code): State | undefined {
    // end of type expression content.
    if (eos(code)) {
      effects.exit(tt.typeExpressionValue)
      return ok(code)
    }

    // consume as type expression content.
    effects.consume(code)
    return insideValue
  }
}

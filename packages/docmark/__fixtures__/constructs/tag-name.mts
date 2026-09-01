/**
 * @file Constructs - tagName
 * @module docmark/constructs/tagName
 */

import factoryIdentifier from '#tests/utils/factory-identifier'
import { codes, ev, tt } from '@flex-development/docmark-util-symbol'
import type {
  Code,
  Effects,
  Event,
  PartialConstruct,
  State,
  TokenizeContext
} from '@flex-development/docmark-util-types'

/**
 * The tag name construct.
 *
 * A tag name consists of an at sign (`@`) followed by an identifier.
 * The identifier must begin with a character that satisfies `ID_Start` and may
 * continue with one or more characters that satisfy `ID_Continue`.
 *
 * Tag names are shared by block and inline tag syntax.
 * Outside an inline tag, an at sign may be immediately preceded by any
 * character besides a backslash (`\`) and left curly brace (`{`).
 * Inside an inline tag, the tag name must immediately follow the opening left
 * curly brace (e.g. `{@linkcode PartialConstruct}`).
 *
 * This construct is `partial` so parent constructs, and if present, their
 * `continuation`, remain the tokenizer's `currentConstruct` during parsing.
 * As such, the enclosing construct remains responsible for content before and
 * after the tag name.
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
 * When tokenizing an inline tag, a tag name can begin only immediately after a
 * left curly brace (`{`).
 * Otherwise, a tag name can begin after any other `code`.
 *
 * @this {TokenizeContext}
 *
 * @param {Code} code
 *  The previous character code
 * @return {boolean}
 *  Whether `code` can precede a tag name
 */
function previousTagName(this: TokenizeContext, code: Code): boolean {
  /**
   * The last emitted event.
   *
   * @const {Event | undefined} tail
   */
  const tail: Event | undefined = this.events.at(-1)

  // inline tag construct checking for tag name.
  if (tail?.[0] === ev.enter && tail[1].type === tt.inlineTag) {
    return code === codes.leftCurlyBrace
  }

  // block tag construct checking for tag name.
  return true
}

/**
 * Tokenize a tag name.
 *
 * A tag name begins with an at sign (`@`) followed by an identifier.
 * The first identifier character must satisfy `ID_Start`; remaining identifier
 * characters must satisfy `ID_Continue`.
 *
 * The construct stops before the first character that cannot continue the
 * identifier.
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
function tokenizeTagName(
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

  return startTagName

  /**
   * At the beginning of a tag name.
   *
   * The previous character is validated before the at sign is consumed.
   *
   * > 👉 **Note**: `␊` represents a line ending.
   *
   * @example
   *  ```markdown
   *  > |@experimental
   *     ^
   *  ```
   *
   * @example
   *  ```markdown
   *  > |@internal␊
   *     ^
   *  ```
   *
   * @example
   *  ```markdown
   *  > |when in a {@linkcode ConstructRecord}, takes precedence over existing
   *                ^
   *  ```
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function startTagName(this: void, code: Code): State | undefined {
    // cannot start a tag name.
    if (code !== codes.atSign) return nok(code)

    // previous code cannot precede a tag name.
    if (self.noPrevious && !previousTagName.call(self, self.previous)) {
      return nok(code)
    }

    // start tag name.
    effects.enter(tt.tagName)

    // capture the tag name marker.
    effects.enter(tt.tagNameMarker)
    effects.consume(code)
    effects.exit(tt.tagNameMarker)

    // try capturing the tag name identifier.
    return factoryIdentifier(
      effects,
      afterIdentifier,
      nok,
      tt.tagNameIdentifier
    )
  }

  /**
   * After the tag name identifier.
   *
   * > 👉 **Note**: `␊` represents a line ending.
   *
   * @example
   *  ```markdown
   *  > |@experimental
   *                  ^
   *  ```
   *
   * @example
   *  ```markdown
   *  > |@internal␊
   *              ^
   *  ```
   *
   * @example
   *  ```markdown
   *  > |when in a {@linkcode ConstructRecord}, takes precedence over existing
   *                         ^
   *  ```
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function afterIdentifier(this: void, code: Code): State | undefined {
    effects.exit(tt.tagName)
    return ok(code)
  }
}

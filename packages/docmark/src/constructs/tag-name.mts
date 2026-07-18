/**
 * @file Constructs - tagName
 * @module docmark/constructs/tagName
 */

import { codes, ev, tt } from '@flex-development/docmark-util-symbol'
import type {
  Code,
  Effects,
  Event,
  PartialConstruct,
  State,
  TokenizeContext
} from '@flex-development/docmark-util-types'
import { idContinue, idStart } from '@flex-development/mark-util-character'

/**
 * The tag name construct.
 *
 * A tag name consists of an at sign (`@`) followed by an identifier.
 * The identifier must begin with a character that satisfies {@linkcode idStart}
 * and may continue with one or more characters that satisfy
 * {@linkcode idContinue}.
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
 * left curly brace (`{`). Otherwise, a tag name cannot begin after a backslash
 * (`\`) or left curly brace.
 *
 * The backslash restriction allows tag-like text to be escaped.
 * The left curly brace restriction prevents ordinary text such as `{@tag` from
 * being recognized as a tag name unless an inline tag construct has already
 * claimed the surrounding syntax.
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
   * The most recent event.
   *
   * Used to determine whether the tokenizer is currently inside an inline tag.
   *
   * @const {Event | undefined} last
   */
  const last: Event | undefined = this.events.at(-1)

  if (last?.[0] === ev.enter && last[1].type === tt.inlineTag) {
    return code === codes.leftCurlyBrace
  }

  return (
    code !== codes.backslash && // escaped.
    code !== codes.graveAccent && // possible markdown code text.
    code !== codes.leftCurlyBrace // inline tag name or type metadata.
  )
}

/**
 * Tokenize a tag name.
 *
 * A tag name begins with an at sign (`@`) followed by an identifier.
 * The first identifier character must satisfy {@linkcode idStart}; remaining
 * identifier characters must satisfy {@linkcode idContinue}.
 *
 * The construct stops before the first character that cannot continue the
 * identifier.
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
   * The tokenization context.
   *
   * @const {TokenizeContext} self
   */
  const self: TokenizeContext = this

  return tagNameStart

  /**
   * At the beginning of a tag name.
   *
   * The previous character is validated before the at sign is consumed.
   *
   * @example
   *  ```markdown
   *  > |@internal
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
  function tagNameStart(this: void, code: Code): State | undefined {
    if (!previousTagName.call(self, self.previous)) return nok(code)
    if (code !== codes.atSign) return nok(code)

    effects.enter(tt.tagName)

    effects.enter(tt.tagNameMarker)
    effects.consume(code)
    effects.exit(tt.tagNameMarker)

    return afterTagNameMarker
  }

  /**
   * After the tag name marker, at the start of the identifier.
   *
   * The first identifier character must satisfy {@linkcode idStart}.
   * A marker without a valid identifier does not form a tag name.
   *
   * @example
   *  ```markdown
   *  > |@internal
   *      ^
   *  ```
   *
   * @example
   *  ```markdown
   *  > |when in a {@linkcode ConstructRecord}, takes precedence over existing
   *                 ^
   *  ```
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function afterTagNameMarker(this: void, code: Code): State | undefined {
    if (!idStart(code)) return nok(code)

    effects.enter(tt.tagNameIdentifier)
    effects.consume(code)

    return tagNameIdentifier
  }

  /**
   * Inside the tag name identifier, after its first character.
   *
   * Identifier-continue characters are consumed until the first character that
   * does not satisfy {@linkcode idContinue}. The tag name is then closed and
   * tokenization succeeds without consuming the current character.
   *
   * @example
   *  ```markdown
   *  > |@internal
   *       ^^^^^^^
   *  ```
   *
   * @example
   *  ```markdown
   *  > |when in a {@linkcode ConstructRecord}, takes precedence over existing
   *                  ^^^^^^^
   *  ```
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function tagNameIdentifier(this: void, code: Code): State | undefined {
    if (idContinue(code)) return effects.consume(code), tagNameIdentifier

    effects.exit(tt.tagNameIdentifier)
    effects.exit(tt.tagName)

    return ok(code)
  }
}

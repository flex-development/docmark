/**
 * @file Constructs - inlineTag
 * @module docmark/constructs/inlineTag
 */

import { factorySpace } from '@flex-development/docmark-factory-space'
import { codes, tt } from '@flex-development/docmark-util-symbol'
import type {
  Code,
  Effects,
  NamedConstruct,
  State,
  TokenizeContext
} from '@flex-development/docmark-util-types'
import { asciiControl, eos } from '@flex-development/mark-util-character'
import { ok as assert } from 'devlop'
import tagName from './tag-name.mts'

/**
 * The inline tag construct.
 *
 * An inline tag begins with a left curly brace (`{`), followed immediately by a
 * tag name, optional whitespace, inline tag text, and a closing right curly
 * brace (`}`).
 *
 * Inline tag text may contain non-control characters and horizontal whitespace.
 * Unless immediately preceded by a backslash (`\`), a right curly brace closes
 * an inline tag.
 *
 * This construct is expected to run at the `text` content level.
 *
 * @const {NamedConstruct} inlineTag
 */
const inlineTag: NamedConstruct = {
  name: tt.inlineTag,
  previous: previousInlineTag,
  tokenize: tokenizeInlineTag
}

export default inlineTag

/**
 * Check if `code` can precede an inline tag.
 *
 * A left curly brace preceded by a backslash cannot begin an inline tag.
 *
 * @this {TokenizeContext}
 *
 * @param {Code} code
 *  The previous character code
 * @return {boolean}
 *  Whether `code` can precede an inline tag
 */
function previousInlineTag(this: TokenizeContext, code: Code): boolean {
  return code !== codes.backslash
}

/**
 * Tokenize an inline tag.
 *
 * The opening left curly brace is consumed before a {@linkcode tagName} is
 * attempted. The tag name must therefore begin immediately after the opening
 * marker.
 *
 * After the tag name, optional whitespace is consumed before inline tag text.
 * The construct succeeds when an unescaped right curly brace is encountered.
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
function tokenizeInlineTag(
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

  return inlineTagStart

  /**
   * At the beginning of an inline tag, before the opening marker.
   *
   * The previous character is checked before the marker is consumed.
   * After entering the inline tag, a tag name is attempted immediately.
   *
   * @example
   *  ```markdown
   *  > |@see {@linkcode Code}
   *          ^
   *  ```
   *
   * @example
   *  ```markdown
   *  > |Event compilation consumes the {@linkcode Event}s of a parser to
   *                                    ^
   *  > |produce a single {@linkcode CompileResult}.
   *                      ^
   *  ```
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function inlineTagStart(this: void, code: Code): State | undefined {
    if (!previousInlineTag.call(self, self.previous)) return nok(code)
    assert(code === codes.leftCurlyBrace, 'expected `codes.leftCurlyBrace`')

    effects.enter(tt.inlineTag)
    effects.consume(code)

    return effects.attempt(tagName, afterTagName, nok)
  }

  /**
   * After tag name, at optional whitespace.
   *
   * Any whitespace between the tag name and inline tag text is captured as
   * {@linkcode tt.whitespace}.
   *
   * @example
   *  ```markdown
   *  > |@see {@linkcode Code}
   *                    ^
   *  ```
   *
   * @example
   *  ```markdown
   *  > |Event compilation consumes the {@linkcode Event}s of a parser to
   *                                              ^
   *  > |produce a single {@linkcode CompileResult}.
   *                                ^
   *  ```
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function afterTagName(this: void, code: Code): State | undefined {
    return factorySpace(effects, atStringChunk, tt.whitespace)(code)
  }

  /**
   * At the beginning of inline tag text.
   *
   * If the current code is a right curly brace and not preceded by a backslash,
   * the inline tag is closed and the construct succeeds.\
   * Otherwise, a {@linkcode tt.chunkString} token is opened at the current
   * position.
   *
   * @example
   *  ```markdown
   *  > |@see {@linkcode Code}
   *                     ^
   *  ```
   *
   * @example
   *  ```markdown
   *  > |Event compilation consumes the {@linkcode Event}s of a parser to
   *                                               ^
   *  > |produce a single {@linkcode CompileResult}.
   *                                 ^
   *  ```
   *
   * @example
   *  ```markdown
   *  > |@see {@linkcode Code Chunk}
   *                     ^
   *  ```
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function atStringChunk(this: void, code: Code): State | undefined {
    if (code === codes.rightCurlyBrace && self.previous !== codes.backslash) {
      effects.consume(code)
      effects.exit(tt.inlineTag)
      return ok
    }

    effects.enter(tt.chunkString)
    return insideStringChunk(code)
  }

  /**
   * Inside inline tag text.
   *
   * An unescaped right curly brace (`}`) closes the current `chunkString` token
   * and the enclosing inline tag.
   *
   * End of stream and ASCII control characters are invalid inside inline tag
   * text and cause the construct to fail.
   *
   * @example
   *  ```markdown
   *  > |@see {@linkcode Code}
   *                     ^^^^
   *  ```
   *
   * @example
   *  ```markdown
   *  > |@see {@linkcode Code Chunk}
   *                     ^^^^^^^^^^
   *  ```
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function insideStringChunk(this: void, code: Code): State | undefined {
    if (code === codes.rightCurlyBrace && self.previous !== codes.backslash) {
      effects.exit(tt.chunkString)
      effects.consume(code)
      effects.exit(tt.inlineTag)
      return ok
    }

    if (asciiControl(code) || eos(code)) return nok(code)
    return effects.consume(code), insideStringChunk
  }
}

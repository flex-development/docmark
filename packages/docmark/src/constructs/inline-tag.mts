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
import { eos } from '@flex-development/mark-parser'
import { ok as assert } from 'devlop'
import tagName from './tag-name.mts'

/**
 * The inline tag construct.
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
 * Check if the previous character code can precede an inline tag.
 *
 * @this {TokenizeContext}
 *
 * @param {Code} code
 *  The character code to check
 * @return {boolean}
 *  `true` if `code` is not {@linkcode codes.backslash}, `false` otherwise
 */
function previousInlineTag(this: TokenizeContext, code: Code): boolean {
  return code !== codes.backslash
}

/**
 * Tokenize an inline tag.
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

  return inlineTag

  /**
   * Start of an inline tag.
   *
   * @example
   *  ```markdown
   *  > | * @see {@linkcode Code}
   *             ^
   *  ```
   *
   * @example
   *  ```markdown
   *  > | * Event compilation consumes the {@linkcode Event}s of a parser to
   *                                       ^
   *  > | * produce a single {@linkcode CompileResult}.
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
  function inlineTag(this: void, code: Code): State | undefined {
    assert(code === codes.leftBrace, 'expected `codes.leftBrace`')

    effects.enter(tt.inlineTag)
    effects.consume(code)

    return effects.attempt(tagName, afterTagName, nok)
  }

  /**
   * After tag name.
   *
   * @example
   *  ```markdown
   *  > | * @see {@linkcode Code}
   *                       ^
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
    return factorySpace(effects, inlineTagText, tt.whitespace)(code)
  }

  /**
   * At inline tag text.
   *
   * @example
   *  ```markdown
   *  > | * @see {@linkcode Code}
   *                        ^
   *  ```
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function inlineTagText(this: void, code: Code): State | undefined {
    effects.enter(tt.inlineTagText)
    return factorySpace(effects, insideInlineTagText, tt.whitespace)(code)
  }

  /**
   * Inside inline tag text.
   *
   * @example
   *  ```markdown
   *  > | * @see {@linkcode Code}
   *                        ^^^^
   *  ```
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function insideInlineTagText(this: void, code: Code): State | undefined {
    if (eos(code)) return nok(code)

    if (code === codes.rightBrace && self.previous !== codes.backslash) {
      effects.exit(tt.inlineTagText)
      effects.consume(code)
      effects.exit(tt.inlineTag)
      return ok
    }

    effects.consume(code)
    return insideInlineTagText
  }
}

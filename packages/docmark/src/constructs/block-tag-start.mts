/**
 * @file Constructs - blockTagStart
 * @module docmark/constructs/blockTagStart
 */

import { factorySpace } from '@flex-development/docmark-factory-space'
import type {
  Code,
  Effects,
  PartialConstruct,
  State,
  TokenizeContext
} from '@flex-development/docmark-util-types'
import { markdownLineEnding } from 'micromark-util-character'
import tagName from './tag-name.mts'

/**
 * The block tag start construct.
 *
 * @const {PartialConstruct} blockTagStart
 */
const blockTagStart: PartialConstruct = {
  partial: true,
  tokenize: tokenizeBlockTagStart
}

export default blockTagStart

/**
 * Tokenize the start of a block tag.
 *
 * @example
 *  ```markdown
 *  > | * @param {State} nok
 *        ^
 *  > | *  The failed tokenization state
 *  ```
 *
 * @example
 *  ```markdown
 *  > | * @param {State} nok
 *  > | *  The failed tokenization state
 *  > | * @return {State}
 *        ^
 *  > | *  The initial state
 *  ```
 *
 * @example
 *  ```markdown
 *  > | * @this {void}
 *        ^
 *  ```
 *
 * @example
 *  ```markdown
 *  > | * @todo item 1 @todo item 2
 *        ^            ^
 *  ```
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
function tokenizeBlockTagStart(
  this: TokenizeContext,
  effects: Effects,
  ok: State,
  nok: State
): State {
  return effects.attempt(tagName, ok, factorySpace(effects, lineEnding))

  /**
   * At a line ending.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function lineEnding(this: void, code: Code): State | undefined {
    if (!markdownLineEnding(code)) return nok(code)
    effects.consume(code)
    return effects.attempt(tagName, ok, factorySpace(effects, lineEnding))
  }
}

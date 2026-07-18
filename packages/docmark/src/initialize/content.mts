/**
 * @file Initialize - content
 * @module docmark/initialize/content
 * @see https://github.com/micromark/micromark/blob/4.0.2/packages/micromark/dev/lib/initialize/content.js
 */

import { factorySpace } from '@flex-development/docmark-factory-space'
import { ct, tt } from '@flex-development/docmark-util-symbol'
import type {
  Code,
  Effects,
  InitialConstruct,
  State,
  Token,
  TokenizeContext
} from '@flex-development/docmark-util-types'
import { eol, eos } from '@flex-development/mark-util-character'
import { ok as assert } from 'devlop'

/**
 * The markdown content construct.
 *
 * @const {InitialConstruct} content
 */
const content: InitialConstruct = { tokenize: tokenizeContent }

export default content

/**
 * @this {TokenizeContext}
 *
 * @param {Effects} effects
 *  The context object to transition the state machine
 * @return {State}
 *  The initial state
 */
function tokenizeContent(this: TokenizeContext, effects: Effects): State {
  /**
   * The initial content state.
   *
   * @const {State} contentStart
   */
  const contentStart: State = effects.attempt(
    this.parser.constructs.contentInitial,
    afterContentStart,
    paragraphInitial
  )

  /**
   * The previous chunk text token.
   *
   * @var {Token | undefined} previous
   */
  let previous: Token | undefined

  return contentStart

  /**
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function afterContentStart(this: void, code: Code): State | undefined {
    if (eos(code)) return void effects.consume(code)
    assert(eol(code), 'expected eol')

    effects.enter(tt.lineEnding)
    effects.consume(code)
    effects.exit(tt.lineEnding)

    return factorySpace(effects, contentStart, tt.linePrefix)
  }

  /**
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function paragraphInitial(this: void, code: Code): State | undefined {
    assert(
      !eos(code) && !eol(code),
      'expected anything other than a line ending or eof'
    )

    effects.enter(tt.paragraph)
    return lineStart(code)
  }

  /**
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function lineStart(this: void, code: Code): State | undefined {
    /**
     * The chunk text token.
     *
     * @const {Token} token
     */
    const token: Token = effects.enter(tt.chunkText, {
      contentType: ct.text,
      previous
    })

    if (previous) previous.next = token
    previous = token

    return data(code)
  }

  /**
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function data(this: void, code: Code): State | undefined {
    if (eos(code)) {
      effects.exit(tt.chunkText)
      effects.exit(tt.paragraph)
      return void effects.consume(code)
    }

    if (eol(code)) {
      effects.consume(code)
      effects.exit(tt.chunkText)
      return lineStart
    }

    effects.consume(code)
    return data
  }
}

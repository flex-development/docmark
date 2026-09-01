/**
 * @file Initialize - flow
 * @module docmark/initialize/flow
 * @see https://github.com/micromark/micromark/blob/4.0.2/packages/micromark/dev/lib/initialize/flow.js
 */

import { factorySpace } from '@flex-development/docmark-factory-space'
import { blankLine } from '@flex-development/docmark-grammar'
import { tt } from '@flex-development/docmark-util-symbol'
import type {
  Code,
  Effects,
  InitialConstruct,
  State,
  TokenizeContext
} from '@flex-development/docmark-util-types'
import { eol, eos } from '@flex-development/mark-util-character'
import { ok as assert } from 'devlop'
import * as commonmark from 'micromark-core-commonmark'

/**
 * The markdown flow construct.
 *
 * @const {InitialConstruct} flow
 */
const flow: InitialConstruct = { tokenize: tokenizeFlow }

export default flow

/**
 * @this {TokenizeContext}
 *
 * @param {Effects} effects
 *  The context object used to transition the state machine
 * @return {State}
 *  The initial state
 */
function tokenizeFlow(this: TokenizeContext, effects: Effects): State {
  /**
   * The tokenization context.
   *
   * @const {TokenizeContext} self
   */
  const self: TokenizeContext = this

  return initial

  /**
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function initial(this: void, code: Code): State | undefined {
    return effects.attempt(
      blankLine, // try to parse a blank line.
      atBlankEnding,
      noBlankLine
    )(code)
  }

  /**
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function noBlankLine(this: void, code: Code): State | undefined {
    return effects.attempt(
      self.parser.constructs.flowInitial, // try to parse initial flow.
      afterFlow,
      noFlowInitial
    )(code)
  }

  /**
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function noFlowInitial(this: void, code: Code): State | undefined {
    return factorySpace(
      effects,
      effects.attempt(self.parser.constructs.flow, afterFlow, noFlow),
      tt.linePrefix
    )(code)
  }

  /**
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function noFlow(this: void, code: Code): State | undefined {
    return effects.attempt(commonmark.content, afterFlow)(code)
  }

  /**
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function atBlankEnding(this: void, code: Code): State | undefined {
    if (eos(code)) return void effects.consume(code)
    assert(eol(code), 'expected eol')

    effects.enter(tt.lineEndingBlank)
    effects.consume(code)
    effects.exit(tt.lineEndingBlank)

    self.currentConstruct = undefined
    return initial
  }

  /**
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function afterFlow(this: void, code: Code): State | undefined {
    if (eos(code)) return void effects.consume(code)
    assert(eol(code), 'expected eol')

    effects.enter(tt.lineEnding)
    effects.consume(code)
    effects.exit(tt.lineEnding)

    self.currentConstruct = undefined
    return initial
  }
}

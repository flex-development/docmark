/**
 * @file Initialize - flow
 * @module docmark/initialize/flow
 * @see https://github.com/micromark/micromark/blob/4.0.2/packages/micromark/dev/lib/initialize/flow.js
 */

import { factorySpace } from '@flex-development/docmark-factory-space'
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
import blankLine from '../constructs/blank-line.mts'

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
 *  The context object to transition the state machine
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

  /**
   * The initial state.
   *
   * @const {State} initial
   */
  const initial: State = effects.attempt(
    blankLine, // try to parse a blank line.
    atBlankEnding,
    effects.attempt(
      this.parser.constructs.flowInitial, // try to parse initial flow.
      afterFlow,
      factorySpace(
        effects,
        effects.attempt(
          this.parser.constructs.flow,
          afterFlow,
          // @ts-expect-error actually a docmark/mark construct (2345).
          effects.attempt(commonmark.content, afterFlow)
        ),
        tt.linePrefix
      )
    )
  )

  return initial

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

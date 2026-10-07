/**
 * @file Constructs - language
 * @module examples/jaymark/initialize/language
 */

import { factorySpace } from '@flex-development/docmark-factory-space'
import {
  blankLine,
  trailingWhitespace
} from '@flex-development/docmark-grammar'
import { tt } from '@flex-development/docmark-util-symbol'
import type {
  Code,
  Construct,
  ContainerState,
  Effects,
  InitialConstruct,
  Place,
  State,
  TokenizeContext
} from '@flex-development/docmark-util-types'
import {
  bos,
  eol,
  eos,
  whitespace
} from '@flex-development/mark-util-character'
import { ok as assert } from 'devlop'
import jt from '../jt.mts'

/**
 * The initial source language construct.
 *
 * @const {InitialConstruct} language
 */
const language: InitialConstruct = { tokenize: tokenizeLanguage }

export default language

/**
 * Tokenize source language content.
 *
 * @this {TokenizeContext}
 *
 * @param {Effects} effects
 *  The context object used to transition the state machine
 * @return {State}
 *  The initial state
 */
function tokenizeLanguage(this: TokenizeContext, effects: Effects): State {
  /**
   * An expression and its persistent state.
   *
   * This is a tuple where the first value is an expression construct and the
   * second value is its persistent container state.
   */
  type Expression = [construct: Construct, state: ContainerState]

  /**
   * The tokenization context.
   *
   * @const {TokenizeContext} self
   */
  const self: TokenizeContext = this

  /**
   * The open expression stack.
   *
   * @const {Expression[]} stack
   */
  const stack: Expression[] = []

  /**
   * The stream position before the current `continuation` attempt.
   *
   * The position is compared with the position after a successful continuation
   * to determine whether the continuation consumed any input.
   *
   * @var {Place | undefined} then
   */
  let then: Place | undefined

  return start

  /**
   * Start or resume scanning source language content.
   *
   * Whitespace and blank lines are handled before attempting to enter a new
   * expression or continue an open expression.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function start(this: void, code: Code): State | undefined {
    self.containerState ??= {} // initialize container state.

    // inside a comment.
    if (self.parser.activeComment) return effects.consume(code), start

    // at least one expression on stack.
    // try continuing the active expression.
    if (stack.length) {
      // at the beginning of a line.
      // first try parsing a blank line.
      // capture line prefix before continuation attempt otherwise.
      if (eol(self.previous)) {
        return effects.attempt(
          blankLine,
          endBlankLine,
          factorySpace(effects, tryContinuation, tt.linePrefix)
        )(code)
      }

      // in the middle of a line.
      // capture arbitrary whitespace before continuation attempt.
      return factorySpace(effects, tryContinuation, tt.whitespace)(code)
    }

    // no expression on stack.

    // at beginning of stream or line.
    // first try parsing a blank line.
    // capture line prefix and try starting a new expression.
    if (bos(self.previous) || eol(self.previous)) {
      return effects.attempt(
        blankLine,
        endBlankLine,
        factorySpace(effects, tryExpression, tt.linePrefix)
      )(code)
    }

    // in the middle of a line.
    // capture arbitrary whitespace before trying to start a new expression.
    return factorySpace(effects, tryExpression, tt.whitespace)(code)
  }

  /**
   * End a blank line.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function endBlankLine(this: void, code: Code): State | undefined {
    assert(eol(code) || eos(code), 'expected line ending or end of stream')

    // at end of stream.
    if (eos(code)) return void end(code)

    // capture the blank line ending.
    effects.enter(tt.lineEndingBlank)
    effects.consume(code)
    effects.exit(tt.lineEndingBlank)
    return start
  }

  /**
   * Try entering a new expression.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function tryExpression(this: void, code: Code): State | undefined {
    assert(!whitespace(code), 'did not expect whitespace')

    // inside a comment.
    if (self.parser.activeComment) return start(code)

    // get ready for a new expression.
    self.containerState = {}

    // try starting a new expression.
    // register the expression if the attempt is successful.
    // try raising an error otherwise.
    return effects.attempt(
      self.parser.constructs.expression,
      takeExpression,
      raise
    )(code)
  }

  /**
   * Register a new expression.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function takeExpression(this: void, code: Code): State | undefined {
    assert(self.containerState, 'expected `containerState`')
    assert(self.currentConstruct, 'expected `currentConstruct`')

    // register the new expression.
    stack.push([self.currentConstruct, self.containerState])

    // no continuation to attempt.
    if (!self.currentConstruct.continuation) return noContinuation(code)

    // immediate container closure requested.
    if (self.containerState._closeFlow) {
      delete self.containerState._closeFlow
      return noContinuation(code)
    }

    // finish the line before resuming scanning.
    if (eol(code)) {
      effects.enter(tt.lineEnding)
      effects.consume(code)
      effects.exit(tt.lineEnding)
      return start
    }

    // try capturing trailing whitespace before resuming scanning.
    return effects.attempt(
      trailingWhitespace,
      afterTrailingWhitespace,
      start
    )(code)
  }

  /**
   * Process trailing whitespace after an expression.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function afterTrailingWhitespace(this: void, code: Code): State | undefined {
    assert(eol(code) || eos(code), 'expected line ending or end of stream')

    // at end of stream.
    if (eos(code)) return void end(code)

    // finish the line.
    effects.enter(tt.lineEnding)
    effects.consume(code)
    effects.exit(tt.lineEnding)
    return start
  }

  /**
   * Try continuing the active expression.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function tryContinuation(this: void, code: Code): State | undefined {
    assert(self.containerState, 'expected `containerState` when continuing')
    assert(stack.length, 'expected at least `1` expression on stack')
    const [construct, containerState] = stack[stack.length - 1]!

    // restore the active expression's persistent state.
    // this ensures continuation runs against its own state.
    self.containerState = containerState

    // capture the current place before attempting continuation.
    // this is used to determine if continuation consumed any input.
    then = self.now()

    // try continuing the active expression.
    assert(construct.continuation, 'expected continuable construct')
    return effects.attempt(
      construct.continuation,
      afterContinuation,
      noContinuation
    )(code)
  }

  /**
   * After a successful continuation.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function afterContinuation(this: void, code: Code): State | undefined {
    assert(self.containerState, 'expected `containerState` after continuing')
    assert(then, 'expected `then` after continuing')

    // immediate container closure requested.
    if (self.containerState._closeFlow) {
      delete self.containerState._closeFlow
      return noContinuation(code)
    }

    /**
     * The current place in the content.
     *
     * @const {Place} now
     */
    const now: Place = self.now()

    // continuation succeeded without consuming input.
    // try entering a new expression from the current point in the stream.
    if (
      then.line === now.line &&
      then.column === now.column &&
      then.offset === now.offset &&
      then._bufferIndex === now._bufferIndex &&
      then._index === now._index
    ) {
      return tryExpression(code)
    }

    // continuation succeeded and consumed input.
    return start(code) // resume scanning normally.
  }

  /**
   * Resume scanning when an expression can no longer continue.
   *
   * The active expression is finalized before scanning resumes.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function noContinuation(this: void, code: Code): State | undefined {
    flush() // finalize the active expression.
    return start(code)
  }

  /**
   * Finish the stream.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {undefined}
   */
  function end(this: void, code: Code): undefined {
    assert(eos(code), 'expected end of stream')

    // finalize all open expression containers.
    flush(stack.length)

    // emit end of content.
    // this is the final event and token.
    effects.enter(tt.eoc)
    effects.consume(code)
    effects.exit(tt.eoc)

    return void code
  }

  /**
   * Finalize open expression containers.
   *
   * @this {void}
   *
   * @param {number | undefined} [count=1]
   *  The number of expression containers to close
   * @return {undefined}
   */
  function flush(this: void, count: number | undefined = 1): undefined {
    /**
     * The number of expression containers finalized.
     *
     * @var {number} k
     */
    let k: number = 0

    // call the exit hook on each expression container.
    while (++k <= count) {
      assert(stack[stack.length - k], 'expected `stack[stack.length - k]`')
      const [construct, containerState] = stack[stack.length - k]!
      self.containerState = containerState
      construct.exit?.call(self, effects)
    }

    // remove closed expressions from the stack.
    stack.length -= count
    return void count
  }

  /**
   * Raise an unexpected character error.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function raise(this: void, code: Code): State | undefined {
    // at end of stream.
    if (eos(code)) return void end(code)

    // capture line ending, then restart from beginning of next line.
    // no need to worry about blank lines; they've already been parsed.
    if (eol(code)) {
      effects.enter(tt.lineEnding)
      effects.consume(code)
      effects.exit(tt.lineEnding)
      return start
    }

    // capture the unexpected character and resume scanning.
    effects.enter(jt.unexpectedValue)
    effects.consume(code)
    effects.exit(jt.unexpectedValue)
    return start
  }
}

/**
 * @file Unit Tests - factory
 * @module docmark-factory-space/tests/unit/factory
 */

import { codes, tt } from '@flex-development/docmark-util-symbol'
import type {
  Code,
  Construct,
  Effects,
  State,
  TokenizeContext
} from '@flex-development/docmark-util-types'
import {
  createTokenizer,
  initialize as initial
} from '@flex-development/mark-parser'
import type { InitialConstruct } from '@flex-development/mark/parse'
import testSubject from '../factory.mts'

describe('unit:factory', () => {
  it.each<[Construct]>([
    [
      {
        /**
         * @this {TokenizeContext}
         *
         * @param {Effects} effects
         *  The context object to transition the state machine
         * @param {State} ok
         *  The successful tokenization state
         * @return {State}
         *  The initial state
         */
        tokenize(this: TokenizeContext, effects: Effects, ok: State): State {
          return testSubject(effects, eat, tt.whitespace)

          /**
           * @this {void}
           *
           * @param {Code} code
           *  The current character code
           * @return {State | undefined}
           *  The next state
           */
          function eat(this: void, code: Code): State | undefined {
            return effects.consume(code), ok
          }
        }
      }
    ],
    [
      {
        /**
         * @this {TokenizeContext}
         *
         * @param {Effects} effects
         *  The context object to transition the state machine
         * @param {State} ok
         *  The successful tokenization state
         * @return {State}
         *  The initial state
         */
        tokenize(this: TokenizeContext, effects: Effects, ok: State): State {
          return testSubject(effects, munch, tt.whitespace, 2)

          /**
           * @this {void}
           *
           * @param {Code} code
           *  The current character code
           * @return {State | undefined}
           *  The next state
           */
          function munch(this: void, code: Code): State | undefined {
            return effects.consume(code), ok
          }
        }
      }
    ]
  ])('should consume codes and produce `type` events (%#)', construct => {
    // Arrange
    const initialize: InitialConstruct = initial(construct)
    const context: TokenizeContext = createTokenizer({ initialize })

    // Setup
    vi.spyOn(context.effects, 'enter')
    vi.spyOn(context.effects, 'exit')

    // Act
    context.write([codes.space, codes.eos])

    // Expect
    expect(context.effects.enter).toHaveBeenCalled()
    expect(context.effects.exit).toHaveBeenCalled()
    expect(context.events).to.be.of.length(2)
    expect(context.events).to.each.have.nested.property('1.type', tt.whitespace)
  })

  it.each<[Construct]>([
    [
      {
        /**
         * @this {TokenizeContext}
         *
         * @param {Effects} effects
         *  The context object to transition the state machine
         * @param {State} ok
         *  The successful tokenization state
         * @return {State}
         *  The initial state
         */
        tokenize(this: TokenizeContext, effects: Effects, ok: State): State {
          return testSubject(effects, eat)

          /**
           * @this {void}
           *
           * @param {Code} code
           *  The current character code
           * @return {State | undefined}
           *  The next state
           */
          function eat(this: void, code: Code): State | undefined {
            return effects.consume(code), ok
          }
        }
      }
    ],
    [
      {
        /**
         * @this {TokenizeContext}
         *
         * @param {Effects} effects
         *  The context object to transition the state machine
         * @param {State} ok
         *  The successful tokenization state
         * @return {State}
         *  The initial state
         */
        tokenize(this: TokenizeContext, effects: Effects, ok: State): State {
          return testSubject(effects, munch, null, 2)

          /**
           * @this {void}
           *
           * @param {Code} code
           *  The current character code
           * @return {State | undefined}
           *  The next state
           */
          function munch(this: void, code: Code): State | undefined {
            return effects.consume(code), ok
          }
        }
      }
    ]
  ])('should consume codes without producing events (%#)', construct => {
    // Arrange
    const initialize: InitialConstruct = initial(construct)
    const context: TokenizeContext = createTokenizer({ initialize })

    // Setup
    vi.spyOn(context.effects, 'enter')
    vi.spyOn(context.effects, 'exit')

    // Act
    context.write([codes.space, codes.eos])

    // Expect
    expect(context.effects.enter).not.toHaveBeenCalled()
    expect(context.effects.exit).not.toHaveBeenCalled()
    expect(context.events).to.be.empty
  })

  it.each<[Construct]>([
    [
      {
        /**
         * @this {TokenizeContext}
         *
         * @param {Effects} effects
         *  The context object to transition the state machine
         * @param {State} ok
         *  The successful tokenization state
         * @return {State}
         *  The initial state
         */
        tokenize(this: TokenizeContext, effects: Effects, ok: State): State {
          return testSubject(effects, eat, tt.whitespace)

          /**
           * @this {void}
           *
           * @param {Code} code
           *  The current character code
           * @return {State | undefined}
           *  The next state
           */
          function eat(this: void, code: Code): State | undefined {
            return effects.consume(code), ok
          }
        }
      }
    ],
    [
      {
        /**
         * @this {TokenizeContext}
         *
         * @param {Effects} effects
         *  The context object to transition the state machine
         * @param {State} ok
         *  The successful tokenization state
         * @return {State}
         *  The initial state
         */
        tokenize(this: TokenizeContext, effects: Effects, ok: State): State {
          return testSubject(effects, munch, tt.whitespace, 2)

          /**
           * @this {void}
           *
           * @param {Code} code
           *  The current character code
           * @return {State | undefined}
           *  The next state
           */
          function munch(this: void, code: Code): State | undefined {
            return effects.consume(code), ok
          }
        }
      }
    ]
  ])('should do nothing without markdown spaces (%#)', construct => {
    // Arrange
    const initialize: InitialConstruct = initial(construct)
    const context: TokenizeContext = createTokenizer({ initialize })

    // Setup
    vi.spyOn(context.effects, 'enter')

    // Act
    context.write([codes.lowercaseA, codes.eos])

    // Expect
    expect(context.effects.enter).not.toHaveBeenCalled()
  })
})

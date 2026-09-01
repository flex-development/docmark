/**
 * @file Initialize - text
 * @module docmark/initialize/text
 * @see https://github.com/micromark/micromark/blob/4.0.2/packages/micromark/dev/lib/initialize/text.js
 */

import {
  codes,
  constants,
  ct,
  ev,
  tt
} from '@flex-development/docmark-util-symbol'
import type {
  Chunk,
  Code,
  Construct,
  ConstructPack,
  ConstructRecord,
  Effects,
  Event,
  InitialConstruct,
  Place,
  Resolver,
  State,
  Token,
  TokenizeContext,
  TokenType
} from '@flex-development/docmark-util-types'
import { eos } from '@flex-development/mark-util-character'
import { splice } from '@flex-development/mark-util-chunked'
import { ok as assert } from 'devlop'

/**
 * The markdown string construct.
 *
 * @const {InitialConstruct} string
 */
const string: InitialConstruct = initializeFactory(ct.string)

/**
 * The markdown text construct.
 *
 * @const {InitialConstruct} text
 */
const text: InitialConstruct = initializeFactory(ct.text)

export { string, text }

/**
 * Create an initial construct.
 *
 * @this {void}
 *
 * @param {'string' | 'text'} contentType
 *  The content type
 * @return {InitialConstruct}
 *  The initial construct
 */
function initializeFactory(
  this: void,
  contentType: 'string' | 'text'
): InitialConstruct {
  /**
   * The content type, capitalized.
   *
   * @const {string} capt
   */
  const capt: string = `${contentType[0]!.toUpperCase()}${contentType.slice(1)}`

  /**
   * The name of the tokenizer.
   *
   * @const {string} tokenizer
   */
  const tokenizer: string = tokenize.name + capt

  return {
    resolveAll: resolver(contentType === 'text' && resolveLineSuffixes),
    tokenize: Object.defineProperties(tokenize, { name: { value: tokenizer } })
  }

  /**
   * @this {TokenizeContext}
   *
   * @param {Effects} effects
   *  The context object used to transition the state machine
   * @return {State}
   *  The initial state
   */
  function tokenize(this: TokenizeContext, effects: Effects): State {
    /**
     * The tokenization context.
     *
     * @const {TokenizeContext} self
     */
    const self: TokenizeContext = this

    /**
     * The constructs to try.
     *
     * @const {ConstructRecord} constructs
     */
    const constructs: ConstructRecord = self.parser.constructs[contentType]

    /**
     * Field state.
     *
     * @const {State} state
     */
    const state: State = effects.attempt(constructs, start, notText)

    return start

    /**
     * @this {void}
     *
     * @param {Code} code
     *  The current character code
     * @return {State | undefined}
     *  The next state
     */
    function start(this: void, code: Code): State | undefined {
      return atBreak(code) ? state(code) : notText(code)
    }

    /**
     * @this {void}
     *
     * @param {Code} code
     *  The current character code
     * @return {State | undefined}
     *  The next state
     */
    function notText(this: void, code: Code): State | undefined {
      if (eos(code)) return void effects.consume(code)
      return effects.enter(tt.data), effects.consume(code), data
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
      if (atBreak(code)) return effects.exit(tt.data), state(code)
      return effects.consume(code), data
    }

    /**
     * @this {void}
     *
     * @param {Code} code
     *  The current character code
     * @return {State | undefined}
     *  The next state
     */
    function atBreak(this: void, code: Code): boolean {
      if (eos(code)) return true

      /**
       * The constructs to try for {@linkcode code}.
       *
       * @const {ConstructPack | undefined} pack
       */
      const pack: ConstructPack | undefined = constructs[code]

      if (pack) {
        assert(Array.isArray(pack), 'expected list of constructs')

        /**
         * The index of the current construct in {@linkcode pack}.
         *
         * @var {number} index
         */
        let index: number = -1

        while (++index < pack.length) {
          assert(pack[index], 'expected `pack[index]`')

          /**
           * The current construct.
           *
           * @const {Construct} item
           */
          const item: Construct = pack[index]! as Construct

          if (!item.previous || item.previous.call(self, self.previous)) {
            return true
          }
        }
      }

      return false
    }
  }

  /**
   * Create a `resolveAll` handler.
   *
   * @this {void}
   *
   * @param {Resolver | false} extraResolver
   *  An additional resolver to run
   * @return {Resolver}
   *  The resolver
   */
  function resolver(this: void, extraResolver: Resolver | false): Resolver {
    /**
     * The name of the resolver.
     *
     * @const {string} name
     */
    const name: string = resolveAll.name + capt

    Object.defineProperties(resolveAll, { name: { value: name } })
    return resolveAll

    /**
     * @this {void}
     *
     * @param {Event[]} events
     *  The current list of events
     * @param {TokenizeContext} context
     *  The tokenization context
     * @return {Event[]}
     *  The list of changed events
     */
    function resolveAll(
      this: void,
      events: Event[],
      context: TokenizeContext
    ): Event[] {
      /**
       * The index of the current event.
       *
       * @var {number} index
       */
      let index: number = -1

      /**
       * The index of the `enter` event.
       *
       * @var {number | undefined} enter
       */
      let enter: number | undefined = undefined

      // merge adjacent `data` events.
      while (++index <= events.length) {
        if (enter === undefined) {
          if (events[index] && events[index]![1].type === tt.data) {
            enter = index
            index++
          }
        } else if (!events[index] || events[index]![1].type !== tt.data) {
          // do nothing if there is one data token.
          if (index !== enter + 2) {
            events[enter]![1].end = events[index - 1]![1].end
            events.splice(enter + 2, index - enter - 2)
            index = enter + 2
          }

          enter = undefined
        }
      }

      return extraResolver ? extraResolver(events, context) : events
    }
  }
}

/**
 * Resolve line suffixes.
 *
 * @this {void}
 *
 * @param {Event[]} events
 *  The current list of events
 * @return {Event[]}
 *  The list of changed events
 */
function resolveLineSuffixes(this: void, events: Event[]): Event[] {
  /**
   * The index of the current event.
   *
   * > 👉 **Note**: Starts at `0` to skip the first event.
   *
   * @var {number} index
   */
  let index: number = 0

  while (++index <= events.length) {
    if (index === events.length || events[index]![1].type === tt.lineEnding) {
      if (events[index - 1]![1].type === tt.data) {
        const [, data, context] = events[index - 1]!

        /**
         * The chunks spanning {@linkcode data}.
         *
         * @const {Chunk[]} chunks
         */
        const chunks: Chunk[] = context.sliceStream(data)

        /**
         * The current buffer index.
         *
         * @var {number} bufferIndex
         */
        let bufferIndex: number = -1

        /**
         * The index of the current chunk.
         *
         * @var {number} chunkIndex
         */
        let chunkIndex: number = chunks.length

        /**
         * The size of the line suffix.
         *
         * @var {number} size
         */
        let size: number = 0

        /**
         * Whether tabs were used.
         *
         * @var {boolean | undefined} tabs
         */
        let tabs: boolean | undefined = undefined

        while (chunkIndex--) {
          /**
           * The current chunk.
           *
           * @const {NonNullable<Chunk>} chunk
           */
          const chunk: NonNullable<Chunk> = chunks[chunkIndex]!

          if (typeof chunk === 'string') {
            bufferIndex = chunk.length

            while (chunk.codePointAt(bufferIndex - 1) === codes.space) {
              size++
              bufferIndex--
            }

            if (bufferIndex) break
            bufferIndex = -1
          } else if (chunk === codes.horizontalTab) {
            tabs = true
            size++
          } else if (chunk !== codes.virtualSpace) {
            chunkIndex++ // nul or replacement character, exit.
            break
          }
        }

        if (size) {
          /**
           * The position of the new token in a string chunk.
           *
           * @const {number} _bufferIndex
           */
          const _bufferIndex: number = chunkIndex
            ? bufferIndex
            : data.start._bufferIndex + bufferIndex

          /**
           * Whether a line suffix token should be inserted.
           *
           * @const {boolean} lineSuffix
           */
          const lineSuffix: boolean = index === events.length ||
            tabs ||
            size < constants.hardBreakPrefixSizeMin

          /**
           * The start point of the new token.
           *
           * @const {Place} start
           */
          const start: Place = {
            line: data.end.line,
            // eslint-disable-next-line sort-keys
            column: data.end.column - size,
            offset: data.end.offset - size,
            // eslint-disable-next-line sort-keys
            _index: data.start._index + chunkIndex,
            // eslint-disable-next-line sort-keys
            _bufferIndex
          }

          /**
           * The token type of the new token.
           *
           * @const {TokenType} type
           */
          const type: TokenType = lineSuffix
            ? tt.lineSuffix
            : tt.hardBreakTrailing

          /**
           * The new token.
           *
           * @const {Token} token
           */
          const token: Token = context.token(type, {
            end: structuredClone(data.end),
            start: (data.end = structuredClone(start), start)
          })

          if (data.start.offset === data.end.offset) {
            Object.assign(data, token)
          } else {
            /**
             * The new `enter` event.
             *
             * @const {Event} enter
             */
            const enter: Event = [ev.enter, token, context]

            /**
             * The new `exit` event.
             *
             * @const {Event} exit
             */
            const exit: Event = [ev.exit, token, context]

            splice(events, index, 0, [enter, exit])
            index += 2
          }
        }

        index++
      }
    }
  }

  return events
}

/**
 * @file blockComment
 * @module examples/jaymark/constructs/blockComment
 */

import {
  factoryBlockComment,
  type Markers
} from '@flex-development/docmark-factory-block'
import type { Sequence } from '@flex-development/docmark-factory-markers'
import { codes, ev, kind, tt } from '@flex-development/docmark-util-symbol'
import type {
  ContinuableConstruct,
  Event,
  TokenizeContext
} from '@flex-development/docmark-util-types'
import { ok as assert } from 'devlop'

/**
 * The block comment construct.
 *
 * This construct is expected to run at the `comments` content level.
 *
 * @see {@linkcode ContinuableConstruct}
 *
 * @const {ContinuableConstruct} blockComment
 */
const blockComment: ContinuableConstruct = factoryBlockComment({
  construct: {
    /**
     * Determine if any `comment` tokens represent docblocks.
     *
     * @this {void}
     *
     * @param {Event[]} events
     *  The current list of events
     * @return {Event[]}
     *  The list of changed events
     */
    resolve(this: void, events: Event[]): Event[] {
      /**
       * The index of the current event.
       *
       * @var {number} index
       */
      let index: number = -1

      while (++index < events.length) {
        assert(events[index], 'expected `events[index]`')
        const [event, token, self] = events[index]!

        // determine if a block comment is a docblock.
        if (
          event === ev.enter &&
          token.type === tt.comment &&
          token.kind === kind.block
        ) {
          assert(self.containerState, 'expected persistent comment state')
          assert(self.containerState.opener, 'expected comment opener token')

          const { opener } = self.containerState

          // a docblock comment opener contains three characters.
          // any other block comment opener contains two characters.
          token.info = opener.end.offset - opener.start.offset === 3
          if (!token.info) delete token.info
        }
      }

      return events
    }
  },

  fields: { info: undefined },

  /**
   * Create a comment markers configuration.
   *
   * @this {TokenizeContext}
   *
   * @return {Markers}
   *  The markers configuration
   */
  markers(this: TokenizeContext): Markers {
    assert(this.parser.constructs.settings, 'expected parser settings')

    /**
     * The comment opener sequence.
     *
     * @const {Sequence} opener
     */
    const opener: Sequence = [
      { code: codes.slash, type: null },
      { code: codes.asterisk, type: null }
    ]

    // add an optional marker to support documentation comments.
    if (this.parser.constructs.settings.json?.docs) {
      opener.push({ code: codes.asterisk, optional: true, type: null })
    }

    return {
      closer: opener.slice(0, 2).toReversed() as Sequence,
      line: codes.asterisk,
      opener
    }
  },

  /**
   * Check whether a block comment is allowed at the current position.
   *
   * @this {TokenizeContext}
   *
   * @return {boolean}
   *  Whether a block comment is not allowed
   */
  skipComment(this: TokenizeContext): boolean {
    assert(this.parser.constructs.settings, 'expected parser settings')

    // comments not allowed.
    if (!this.parser.constructs.settings.json?.comments) return true

    // comment not allowed at the current position.
    return !!this.parser.skipComment
  }
})

export default blockComment

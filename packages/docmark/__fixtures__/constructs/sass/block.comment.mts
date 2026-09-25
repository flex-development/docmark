/**
 * @file Constructs - blockComment
 * @module docmark/fixtures/sass/block
 */

import factory, { type Markers } from '@flex-development/docmark-factory-block'
import { codes, ev, kind, tt } from '@flex-development/docmark-util-symbol'
import type {
  ContinuableConstruct,
  Event,
  TokenizeContext
} from '@flex-development/docmark-util-types'
import { ok } from 'devlop'

/**
 * The sass block comment construct.
 *
 * This construct is expected to run at the `source` content level.
 *
 * @const {ContinuableConstruct} blockComment
 */
const blockComment: ContinuableConstruct = factory({
  /**
   * Check whether continued lines can be indented in lieu
   * of an explicit line marker.
   *
   * @this {TokenizeContext}
   *
   * @return {boolean}
   *  Whether a continued line can be indented
   */
  allowIndentedContinuation(this: TokenizeContext): boolean {
    return true
  },

  construct: { resolve: resolveBlockComment },
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
    return {
      closer: [
        { code: codes.asterisk, type: null },
        { code: codes.slash, type: null }
      ],
      line: codes.asterisk,
      opener: [
        { code: codes.slash, type: null },
        { code: codes.asterisk, type: null },
        { code: codes.asterisk, optional: true, type: null }
      ]
    }
  }
})

export default blockComment

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
function resolveBlockComment(this: void, events: Event[]): Event[] {
  /**
   * The index of the current event.
   *
   * @var {number} index
   */
  let index: number = -1

  while (++index < events.length) {
    ok(events[index], 'expected `events[index]`')
    const [event, token, self] = events[index]!

    // determine if a block comment is a docblock.
    // the `source` initializer hoists this information via `containerState`
    // using the `documentation` property.
    if (
      event === ev.enter &&
      token.type === tt.comment &&
      token.kind === kind.block
    ) {
      ok(self.containerState, 'expected `containerState` inside comment')
      ok(self.containerState.openerWidth, 'expected comment opener width')

      // a docblock comment opener contains three characters.
      // any other block comment opener contains two characters.
      token.info = self.containerState.openerWidth === 3
      if (!token.info) delete token.info
    }
  }

  return events
}

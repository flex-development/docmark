/**
 * @file Constructs - blockComment
 * @module docmark/fixtures/blockComment
 */

import factory, { type Markers } from '@flex-development/docmark-factory-block'
import { codes, ev, kind, tt } from '@flex-development/docmark-util-symbol'
import type {
  ContinuableConstruct,
  Event,
  NamedConstruct,
  TokenFields,
  TokenizeContext
} from '@flex-development/docmark-util-types'
import { ok } from 'devlop'

/**
 * The JavaScript block comment construct.
 *
 * @const {ContinuableConstruct & NamedConstruct} blockComment
 */
const blockComment: ContinuableConstruct & NamedConstruct = factory({
  construct: {
    name: `${tt.comment}:${kind.block}`,
    resolve: resolveBlockComment
  },

  /**
   * Create a token fields object.
   *
   * @this {TokenizeContext}
   *
   * @return {TokenFields}
   *  The token fields object
   */
  fields(this: TokenizeContext): TokenFields {
    return { info: undefined }
  },

  /**
   * Finalize the block comment construct.
   *
   * @this {void}
   *
   * @param {ContinuableConstruct} construct
   *  The construct to finalize
   * @return {undefined}
   */
  finalizeConstruct(this: void, construct: ContinuableConstruct): undefined {
    return void construct
  },

  /**
   * Create a markers configuration.
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
      ok(self.containerState.opener, 'expected comment opener token')

      const { opener } = self.containerState

      // a docblock comment opener contains three characters.
      // any other block comment opener contains two characters.
      token.info = opener.end.offset - opener.start.offset === 3
      if (!token.info) delete token.info
    }
  }

  return events
}

/**
 * @file Fixtures - lineComment
 * @module docmark/fixtures/constructs/sass/line
 */

import factory from '@flex-development/docmark-factory-line'
import { codes, ev, kind, tt } from '@flex-development/docmark-util-symbol'
import type {
  ContinuableConstruct,
  Event,
  TokenizeContext
} from '@flex-development/docmark-util-types'
import { ok } from 'devlop'

/**
 * The sass line comment construct.
 *
 * This construct is expected to run at the `source` content level.
 *
 * @const {ContinuableConstruct} lineComment
 */
const lineComment: ContinuableConstruct = factory({
  /**
   * Check whether continued lines can be indented in lieu of explicit markers.
   *
   * @this {TokenizeContext}
   *
   * @return {boolean}
   *  Whether a continued line can be indented
   */
  allowIndentedContinuation(this: TokenizeContext): boolean {
    return true
  },
  construct: { resolve: resolveLineComment },
  fields: { info: undefined },
  markers: [codes.slash, codes.slash, { code: codes.slash, optional: true }]
})

export default lineComment

/**
 * Determine if any `comment` tokens represent docline comments.
 *
 * @this {void}
 *
 * @param {Event[]} events
 *  The current list of events
 * @return {Event[]}
 *  The list of changed events
 */
function resolveLineComment(this: void, events: Event[]): Event[] {
  /**
   * The index of the current event.
   *
   * @var {number} index
   */
  let index: number = -1

  while (++index < events.length) {
    ok(events[index], 'expected `events[index]`')
    const [event, token, self] = events[index]!

    // determine if a line comment is a docline.
    // the `source` initializer hoists this information via `containerState`
    // using the `documentation` property.
    if (
      event === ev.enter &&
      token.type === tt.comment &&
      token.kind === kind.line
    ) {
      ok(self.containerState, 'expected `containerState` inside comment')
      ok(self.containerState.openerWidth, 'expected comment opener width')

      // a docline comment opener contains three characters.
      // any other line comment opener contains two characters.
      token.info = self.containerState.openerWidth === 3
      if (!token.info) delete token.info
    }
  }

  return events
}

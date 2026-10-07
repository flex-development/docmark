/**
 * @file postprocess
 * @module docmark/postprocess
 */

import { subtokenize } from '@flex-development/docmark-util-subtokenize'
import { ev, tt } from '@flex-development/docmark-util-symbol'
import type { Event } from '@flex-development/docmark-util-types'
import { splice } from '@flex-development/mark-util-chunked'
import { ok as assert } from 'devlop'

/**
 * Postprocess events.
 *
 * This function repeatedly calls {@linkcode subtokenize} until all embedded
 * content is parsed.
 *
 * @todo remove trailing blank lines when indented syntax is enabled
 *
 * @see {@linkcode Event}
 *
 * @this {void}
 *
 * @param {Event[]} events
 *  The current list of events
 * @return {Event[]}
 *  The list of changed events
 */
function postprocess(this: void, events: Event[]): Event[] {
  while (!subtokenize(events)); // tokenize subtokens.

  /**
   * The index of the current event.
   *
   * @var {number} index
   */
  let index: number = -1

  while (++index < events.length) {
    assert(events[index], 'expected `events[index]`')
    const [event, token] = events[index]!

    // remove the `eoc` event pack if it isn't the last pack.
    if (
      event === ev.enter &&
      token.type === tt.eoc &&
      events[index + 2] !== undefined
    ) {
      splice(events, index, 2) // drop `enter` and `exit` event.
    }
  }

  return events
}

export default postprocess

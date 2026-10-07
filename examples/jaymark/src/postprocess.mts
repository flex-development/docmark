/**
 * @file postprocess
 * @module examples/jaymark/postprocess
 */

import * as docmark from '@flex-development/docmark'
import type { Event } from '@flex-development/docmark-util-types'

/**
 * Postprocess events.
 *
 * @todo resolve object members
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
  docmark.postprocess(events) // tokenize embedded subcontent.
  return events
}

export default postprocess

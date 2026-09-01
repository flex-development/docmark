/**
 * @file postprocess
 * @module docmark/postprocess
 */

import { subtokenize } from '@flex-development/docmark-util-subtokenize'
import type { Event } from '@flex-development/docmark-util-types'
import resolveRegionExits from './resolvers/region-exits.mts'

/**
 * Postprocess events.
 *
 * @todo resolve trailing whitespace
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
  while (!subtokenize(events));
  return resolveRegionExits(events)
}

export default postprocess

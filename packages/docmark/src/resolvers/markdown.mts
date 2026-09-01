/**
 * @file Resolvers - resolveMarkdown
 * @module docmark/resolvers/markdown
 */

import type { Event } from '@flex-development/docmark-util-types'
import { postprocess } from 'micromark'
import type * as micromark from 'micromark-util-types'

/**
 * Postprocess markdown events.
 *
 * @internal
 *
 * @template {Event[] | micromark.Event[]} T
 *  The list of events
 *
 * @this {void}
 *
 * @param {T} events
 *  The current list of events
 * @return {T}
 *  The list of changed events
 */
function resolveMarkdown<T extends Event[] | micromark.Event[]>(
  this: void,
  events: T
): T {
  // @ts-expect-error micromark-shaped events (2345).
  return postprocess(events)
}

export default resolveMarkdown

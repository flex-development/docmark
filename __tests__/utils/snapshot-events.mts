/**
 * @file Test Utilities - snapshotEvents
 * @module tests/utils/snapshotEvents
 */

import { ev, tt } from '@flex-development/docmark-util-symbol'
import type {
  Event,
  EventType,
  Token
} from '@flex-development/docmark-util-types'

/**
 * Get a snapshot-compliant list of events.
 *
 * @this {void}
 *
 * @param {Event[]} events
 *  List of events
 * @return {[EventType, Token][]}
 *  List of event types and tokens
 */
function snapshotEvents(this: void, events: Event[]): [EventType, Token][] {
  return events.map(([event, token, self]) => {
    if (
      event === ev.enter &&
      token.type !== tt.blockTag &&
      token.type !== tt.comment &&
      token.type !== tt.commentLinePrefix &&
      token.type !== tt.content &&
      token.type !== tt.eoc &&
      token.type !== tt.inlineTag &&
      token.type !== tt.paragraph &&
      token.type !== tt.summary &&
      token.type !== tt.tagName &&
      token.type !== tt.tagNameMarker &&
      token.type !== tt.whitespace &&
      !Object.prototype.hasOwnProperty.call(token, 'value')
    ) {
      token.value = self.sliceSerialize(token)
    }

    return [event, token] as const
  })
}

export default snapshotEvents

/**
 * @file Resolvers - resolveRegionExits
 * @module docmark/resolvers/resolveRegionExits
 */

import { ev, tt } from '@flex-development/docmark-util-symbol'
import type { Event, Token } from '@flex-development/docmark-util-types'
import { splice } from '@flex-development/mark-util-chunked'
import { ok as assert } from 'devlop'

export default resolveRegionExits

/**
 * Move comment region `exit` events so they're positioned before line endings
 * and trailing whitespace.
 *
 * @internal
 *
 * @this {void}
 *
 * @param {Event[]} events
 *  The current list of events
 * @return {Event[]}
 *  The list of changed events
 */
function resolveRegionExits(this: void, events: Event[]): Event[] {
  /**
   * The index of the current event.
   *
   * @var {number} index
   */
  let index: number = -1

  /**
   * The current region token.
   *
   * @var {Token | undefined} region
   */
  let region: Token | undefined

  while (++index < events.length) {
    assert(events[index], 'expected `events[index]`')
    const [event, token, self] = events[index]!

    // handle region state.
    // on enter, we're inside a region.
    // on exit, we're leaving the region.
    if (token._region) {
      if (event === ev.enter) {
        region = token
      } else {
        region = undefined // now outside of a region.

        /**
         * The index of the previous event.
         *
         * @const {number} previousIndex
         */
        const previousIndex: number = index - 1

        assert(events[previousIndex], 'expected `events[previousIndex]`')
        const [previousEvent, previousToken] = events[previousIndex]

        // line endings are sometimes preceded by hard breaks, line suffixes,
        // or trailing whitespace that hasn't been resolved yet.
        // finish moving the region `exit` event ahead of the pairing.
        if (
          previousEvent === ev.exit &&
          (
            previousToken.type === tt.hardBreakEscape ||
            previousToken.type === tt.hardBreakTrailing ||
            previousToken.type === tt.lineSuffix ||
            previousToken._trailing
          )
        ) {
          // fix end position of comment region.
          token.end = structuredClone(previousToken.start)

          // remove original comment region `exit` event.
          splice(events, index, 1)

          // re-add comment region `exit` event.
          splice(events, previousIndex - 1, 0, [[event, token, self]])

          // the index of the region `exit` event is now `index - 2`,
          // and index of the trailing whitespace `exit` event is `index`.

          continue
        }
      }
    }

    // look for a comment region `exit` event
    // after one or more line endings or blank lines.
    // if found, move the `exit` event ahead of the current line ending.
    if (region && event === ev.enter && token.type === tt.lineEnding) {
      /**
       * The position of the current inner event.
       *
       * @var {number} position
       */
      let position: number = index + 1

      while (++position < events.length) {
        assert(events[position], 'expected `events[position]`')
        assert(token !== events[position]![1], 'did not expect `token` match')

        /**
         * The current event.
         *
         * @const {Event} event
         */
        const event: Event = events[position]!

        if (region === event[1]) {
          assert(event[0] === ev.exit, 'expected region `exit` event')

          // fix end position of region.
          event[1].end = structuredClone(token.start)

          splice(events, position, 1) // remove original region `exit` event.
          splice(events, index, 0, [event]) // re-add region `exit` event.

          // the index of the region `exit` event is now `index`.
          // move backwards to revisit the `exit` event.
          index--
          break
        }

        if (event[0] === ev.enter) {
          if (event[1].type === tt.linePrefix) {
            /**
             * The difference between the position of the `lineEndingBlank`
             * event and the current event.
             *
             * @const {number} k
             */
            const k: number = 2

            if (events[position + k]?.[1].type !== tt.lineEndingBlank) {
              index++
              break
            } else {
              position += k
            }
          } else if (
            event[1].type !== token.type &&
            event[1].type !== tt.lineEndingBlank
          ) {
            index++
            break
          }
        }
      }
    }
  }

  return events
}

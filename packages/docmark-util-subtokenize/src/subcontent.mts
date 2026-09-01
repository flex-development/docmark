/**
 * @file subcontent
 * @module docmark-util-subtokenize/subcontent
 */

import { codes, ev } from '@flex-development/docmark-util-symbol'
import type {
  Chunk,
  Event,
  Token,
  TokenizeContext
} from '@flex-development/docmark-util-types'
import { splice } from '@flex-development/mark-util-chunked'
import { ok } from 'devlop'
import eolset from './internal/eolset.mts'

export default subcontent

/**
 * Tokenize embedded content for a single token.
 *
 * This algorithm has three phases:
 *
 * 1. Feed linked chunk tokens to a child tokenizer
 * 2. Determine which child events belong to each linked token
 * 3. Replace `chunk*` events with their corresponding child events
 *
 * @this {void}
 *
 * @param {Event[]} events
 *  The parent event stream
 * @param {number} eventIndex
 *  The index of the first chunk `enter` event
 * @return {undefined}
 */
function subcontent(
  this: void,
  events: Event[],
  eventIndex: number
): undefined {
  ok(events[eventIndex], 'expected `events[eventIndex]`')
  const [event, token, context] = events[eventIndex]

  ok(event === ev.enter, 'expected enter event')
  ok(token.contentType, 'expected `token.contentType`')
  ok(/^chunk[A-Z][a-z]+$/.test(token.type), 'expected chunk token')

  /**
   * The child tokenizer responsible for embedded content.
   *
   * @const {TokenizeContext} child
   */
  const child: TokenizeContext = token._tokenizer && 'write' in token._tokenizer
    ? token._tokenizer
    : context.parser[token.contentType](token.start)

  /**
   * The parent `enter` event positions for each linked token.\
   * The matching `exit` event is expected to be at `positions[i] + 1` in the
   * event stream.
   *
   * @const {number[]} positions
   */
  const positions: number[] = []

  /**
   * The current token.
   *
   * Each chunk token is linked together:
   *
   *   previous <---> current <---> next
   *
   * This lets a logical piece of content span multiple tokens.
   *
   * @var {Token | undefined} token
   */
  let current: Token | undefined = token

  /**
   * The index of the `enter` event for the {@linkcode current} linked token.
   *
   * Linked tokens occur in source order, so each search can continue after the
   * previously discovered `enter` event.
   *
   * @var {number} position
   */
  let position: number = eventIndex - 1

  /**
   * The previous linked token.
   *
   * @var {Token | undefined} previous
   */
  let previous: Token | undefined

  // loop through linked tokens to pass them in order to the child tokenizer.
  while (current) {
    // find the `enter` event index for `current`.
    while (++position < events.length) {
      ok(events[position], 'expected `events[j]`')
      const [event, eventToken] = events[position]!

      // store `enter` event index for linked token.
      // this is used to splice child events back into the parent stream.
      if (event === ev.enter && eventToken === current) {
        positions.push(position)
        break
      }
    }

    ok(position < events.length, 'expected `enter` event for linked token')
    ok(!previous || current.previous === previous, 'expected previous to match')
    ok(!previous || previous.next === current, 'expected next to match')

    // write to `child` if the event stream hasn't been closed.
    // the child event stream is considered closed when a tokenizer has already
    // been attached to the `current` token. the child parse is assumed to have
    // already been ran by the construct who attached to the tokenizer.
    if (!current._tokenizer) {
      /**
       * The chunks contributed by the {@linkcode current} linked token.
       *
       * @const {Chunk[]} chunks
       */
      const chunks: Chunk[] = context.sliceStream(current)

      // tell the `child` tokenizer where the current line starts.
      // since containers "nibble" a prefix from margins,
      // where a line starts after that prefix is defined here.
      if (current.previous) child.defineSkip(current.start)

      // signal end of `child` stream.
      if (!current.next) chunks.push(codes.eos)

      // write chunks to the `child` stream.
      void child.write(chunks)
    }

    // move onto the next linked token.
    previous = current
    current = current.next
  }

  /**
   * The list of child tokens that have already been seen.
   *
   * @const {WeakSet<Token>} seen
   */
  const seen: WeakSet<Token> = new WeakSet<Token>()

  /**
   * The index of the current {@linkcode child} event.
   *
   * @var {number} index
   */
  let childIndex: number = child.events.length - 1

  // find the child events belonging to each linked token.
  // go from back to front so earlier splices do not shift parent positions.
  for (let i = positions.length - 1; i >= 0; i--) {
    ok(positions[i] !== undefined, 'expected `enter` index for linked token')
    position = positions[i]!

    /**
     * The list of child events within the range of the current linked token.
     *
     * @const {Event[]} bucket
     */
    const bucket: Event[] = []

    /**
     * The current linked token.
     *
     * @const {Token | undefined} linked
     */
    const linked: Token | undefined = events[position]![1]

    ok(linked, 'expected `linked` token')
    ok(linked.contentType, 'expected linked token with `contentType`')

    for (let j = childIndex; j >= 0; j--) {
      ok(child.events[j], 'expected `child.events[j]`')
      const [event, token, self] = child.events[j]!

      // entering or exiting a token that starts and ends on the same line.
      if (token.start.line === token.end.line) {
        ok(
          token.start.offset >= linked.start.offset,
          'expected same line token to start after or at linked chunk start'
        )

        ok(
          token.end.offset <= linked.end.offset,
          'expected same line token to end before or at linked chunk end'
        )

        // add child event to bucket and mark token as seen.
        bucket.unshift([event, token, self])
        seen.add(token)

        // skip to the next child event.
        continue
      }

      // at a line ending.
      if (
        token.start._bufferIndex < 0 &&
        token.end._bufferIndex < 0 &&
        token.end.offset !== token.start.offset
      ) {
        // line ending already added to bucket.
        if (seen.has(token)) {
          ok(event === ev.enter, 'expected line ending `enter` event')
          bucket.unshift([event, token, self])
          continue
        }

        // fix end point.
        // tokens representing line endings should end at column `1`,
        // but may not when the token is closed after `defineSkip` is called
        // and a skip is applied.
        if (token.end.column !== 1) {
          /**
           * The chunks spanning the current token.
           *
           * @const {Chunk[]} stream
           */
          const stream: Chunk[] = self.sliceStream(token)

          ok(stream.length === 1, 'expected `token` to span one chunk')
          ok(stream[0] !== undefined, 'expected chunk')
          ok(stream[0] !== codes.eos, 'expected no end of stream code')
          ok(typeof stream[0] === 'number', 'expected character code chunk')

          // eol tokens end at column `1`.
          // the offset of eol tokens depends on the actual eol code.
          token.end.column = 1
          token.end.offset = eolset(stream[0], token.start.offset)
        }

        // we move from back to front.
        ok(event === ev.exit, 'expected line ending `exit` event')

        // exiting a line ending.
        // the line ending may or may not belong to the current linked token.
        // the linked token represents a blank or non-blank line.
      }

      // exiting a token that spans multiple lines.
      if (event === ev.exit) {
        // child token belongs to a different linked token.
        if (
          // token ends before the linked token starts...
          token.end.offset <= linked.start.offset ||
          // ...or after the linked token ends.
          token.end.offset > linked.end.offset
        ) {
          childIndex = j
          break
        }

        // child token belongs to the current linked token.
        // the token ends before or at linked token's end.
        bucket.unshift([event, token, self]) // add to bucket.
        seen.add(token) // mark token as seen.

        // skip to the next child event.
        continue
      }

      // entering a multiline token.
      ok(seen.has(token), 'expected to have seen multiline `token`')
      bucket.unshift([event, token, self])
    }

    // insert child events into the parent stream.
    splice(events, position, 2, bucket)
  }

  // child events now exist in the parent stream.
  child.events = []
  return void child.events
}

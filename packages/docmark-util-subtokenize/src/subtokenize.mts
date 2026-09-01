/**
 * @file subtokenize
 * @module docmark-util-subtokenize/subtokenize
 */

import { ev } from '@flex-development/docmark-util-symbol'
import type { ContentType, Event } from '@flex-development/docmark-util-types'
import { ok } from 'devlop'
import subcontent from './subcontent.mts'

export default subtokenize

/**
 * Tokenize embedded content.
 *
 * Some tokens declare a {@linkcode ContentType}.
 * These tokens do not contain fully parsed content themselves.
 * Tokens with a `chunk*` (i.e. `chunkMarkdown`, `chunkDocument`, `chunkFlow`)
 * type and a `contentType` act as containers for another tokenizer.
 *
 * For example:
 *
 * ```text
 * comment
 * └─ chunkComment
 * ```
 *
 * A `chunkComment` token may contain markdown, block tags, inline tags, and
 * other syntax. This function replaces those chunk tokens with the events
 * produced by their child tokenizer.
 *
 * Linked chunks are handled as one logical stream, but child events are spliced
 * back into the same positions as the original chunk tokens. This preserves
 * surrounding events such as ones for `commentLinePrefix`.
 *
 * @this {void}
 *
 * @param {Event[]} events
 *  The current list of events
 * @return {boolean}
 *  Whether subtokens (embedded content) were found
 */
function subtokenize(this: void, events: Event[]): boolean {
  /**
   * Whether subtokens were found.
   *
   * @var {boolean} found
   */
  let found: boolean = false

  /**
   * The index of the current event.
   *
   * @var {number} index
   */
  let index: number = -1

  while (++index < events.length) {
    ok(events[index], 'expected `events[index]`')
    const [event, token] = events[index]!

    // only `enter` events can introduce embedded content.
    if (event !== ev.enter) continue

    // tokens without a content type are already fully tokenized.
    if (!token.contentType) continue

    // tokenize embedded content.
    subcontent(events, index)
    found = true

    // revisit inserted events, so child chunks are also tokenized.
    index--
  }

  return !found
}

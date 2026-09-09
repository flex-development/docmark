/**
 * @file factoryMarkers
 * @module docmark-factory-markers/factory
 */

import type { Info, Sequence } from '@flex-development/docmark-factory-markers'
import { tt } from '@flex-development/docmark-util-symbol'
import type {
  Code,
  Effects,
  Marker,
  State
} from '@flex-development/docmark-util-types'
import { ok as assert } from 'devlop'

/**
 * Create a state that tokenizes a sequence of comment markers.
 *
 * The returned state consumes each marker in `marks` in order.\
 * Each marker produces a token using the specified token type,
 * or {@linkcode tt.commentMarker} by default.
 *
 * If the input does not match the expected sequence, tokenization fails
 * without consuming the mismatching character.
 *
 * @see {@linkcode Effects}
 * @see {@linkcode Marker}
 * @see {@linkcode Sequence}
 * @see {@linkcode State}
 *
 * @this {void}
 *
 * @param {Effects} effects
 *  The context object used to transition the state machine
 * @param {State} ok
 *  The successful tokenization state
 * @param {State} nok
 *  The failed tokenization state
 * @param {Marker | Sequence} marks
 *  The comment marker code or sequence
 * @return {State}
 *  The initial state
 */
function factoryMarkers(
  this: void,
  effects: Effects,
  ok: State,
  nok: State,
  marks: Marker | Sequence
): State {
  // normalize initial sequence.
  if (!Array.isArray(marks)) marks = [marks]

  /**
   * The normalized marker sequence.
   *
   * @const {Info[]} seq
   */
  const seq: Info[] = [...marks].map(m => typeof m === 'number' ? [m] : m)

  /**
   * The index of the current marker.
   *
   * @var {number} index
   */
  let index: number = 0

  // try capturing the marker sequence.
  return assert(seq.length, 'expected non-empty marker sequence'), maybeMarker

  /**
   * Attempt to tokenize the next marker in the sequence.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function maybeMarker(this: void, code: Code): State | undefined {
    if (index === seq.length) return ok(code) // sequence complete.
    const [marker, type = tt.commentMarker, fields] = seq[index++]! // unwrap.

    // unexpected code.
    if (code !== marker) return nok(code)

    // capture the current marker.
    effects.enter(type, fields)
    effects.consume(code)
    effects.exit(type)

    // try capturing the next marker.
    return maybeMarker
  }
}

export default factoryMarkers

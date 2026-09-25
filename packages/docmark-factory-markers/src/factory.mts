/**
 * @file factoryMarkers
 * @module docmark-factory-markers/factory
 */

import type { Info, Sequence } from '@flex-development/docmark-factory-markers'
import { normalize } from '@flex-development/docmark-factory-markers/utils'
import { tt } from '@flex-development/docmark-util-symbol'
import type {
  Code,
  Effects,
  Marker,
  State
} from '@flex-development/docmark-util-types'
import type { CodeCheck } from '@flex-development/mark/parse'
import { ok as assert } from 'devlop'
import terminate from './internal/terminate.mts'

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
 * @see {@linkcode CodeCheck}
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
 * @param {CodeCheck | Info | Marker | Sequence} marks
 *  The comment marker matcher, info, code, or sequence
 * @return {State}
 *  The initial state
 */
function factoryMarkers(
  this: void,
  effects: Effects,
  ok: State,
  nok: State,
  marks: CodeCheck | Info | Marker | Sequence
): State {
  // normalize initial sequence.
  if (!Array.isArray(marks)) marks = [marks]

  /**
   * The normalized marker sequence.
   *
   * @const {Info[]} seq
   */
  const seq: Info[] = [...marks].map(normalize)

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

    /**
     * The comment marker info.
     *
     * @const {Info} info
     */
    const info: Info = Object.assign({}, seq[index++])

    /**
     * Whether {@linkcode code} matches the expected marker.
     *
     * @const {boolean} matches
     */
    const matches: boolean = typeof info.code === 'function'
      ? info.code(code)
      : info.code === code

    // unexpected code.
    if (!matches) return terminate(info.optional, ok, nok)(code)

    // normalize the token type.
    if (info.type === undefined) info.type = tt.commentMarker

    // capture the current marker.
    info.type && effects.enter(info.type, { ...info.fields })
    effects.consume(code)
    info.type && effects.exit(info.type)

    // try capturing the next marker.
    return maybeMarker
  }
}

export default factoryMarkers

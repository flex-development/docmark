/**
 * @file Internal - finalMarker
 * @module docmark-factory-block/internal/finalMarker
 */

import type { Info, Sequence } from '@flex-development/docmark-factory-markers'

/**
 * Get the last marker in a marker sequence.
 *
 * @internal
 *
 * @this {void}
 *
 * @param {Sequence | Sequence[0]} sequence
 *  The marker sequence to evaluate
 * @return {Info}
 *  The info representing the last marker in `sequence`
 */
function finalMarker(this: void, sequence: Sequence | Sequence[0]): Info {
  if (Array.isArray(sequence)) return finalMarker(sequence.at(-1)!)
  return typeof sequence === 'object' ? sequence : { code: sequence }
}

export default finalMarker

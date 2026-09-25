/**
 * @file Internal - firstMarker
 * @module docmark-factory-block/internal/firstMarker
 */

import type { Info, Sequence } from '@flex-development/docmark-factory-markers'

/**
 * Get the first marker in a marker sequence.
 *
 * @internal
 *
 * @this {void}
 *
 * @param {Sequence | Sequence[0]} sequence
 *  The marker sequence to evaluate
 * @return {Info}
 *  The info representing the first marker in `sequence`
 */
function firstMarker(this: void, sequence: Sequence | Sequence[0]): Info {
  if (Array.isArray(sequence)) return firstMarker(sequence[0])
  return typeof sequence === 'object' ? sequence : { code: sequence }
}

export default firstMarker

/**
 * @file Internal - firstMarker
 * @module docmark-factory-block/internal/firstMarker
 */

import type { Info, Sequence } from '@flex-development/docmark-factory-markers'
import type { Marker } from '@flex-development/docmark-util-types'

/**
 * Get the first marker in a marker sequence.
 *
 * @internal
 *
 * @this {void}
 *
 * @param {Marker | Sequence} sequence
 *  The marker sequence to evaluate
 * @return {Marker}
 *  The first marker in `sequence`
 */
function firstMarker(this: void, sequence: Info | Marker | Sequence): Marker {
  if (Array.isArray(sequence)) return firstMarker(sequence[0])
  return typeof sequence === 'number' ? sequence : sequence.code
}

export default firstMarker

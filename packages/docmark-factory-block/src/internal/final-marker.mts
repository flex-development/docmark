/**
 * @file Internal - finalMarker
 * @module docmark-factory-block/internal/finalMarker
 */

import type { Info, Sequence } from '@flex-development/docmark-factory-markers'
import type { Marker } from '@flex-development/docmark-util-types'

/**
 * Get the last marker in a marker sequence.
 *
 * @internal
 *
 * @this {void}
 *
 * @param {Info | Marker | Sequence} sequence
 *  The marker sequence to evaluate
 * @return {Info}
 *  The info representing the last marker in `sequence`
 */
function finalMarker(this: void, sequence: Info | Marker | Sequence): Info {
  if (Array.isArray(sequence)) return finalMarker(sequence.at(-1)!)
  return typeof sequence === 'number' ? { code: sequence } : sequence
}

export default finalMarker

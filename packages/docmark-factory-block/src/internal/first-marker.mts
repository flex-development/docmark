/**
 * @file Internal - firstMarker
 * @module docmark-factory-block/internal/firstMarker
 */

import type {
  MarkerInfo,
  MarkerSequence
} from '@flex-development/docmark-util-types'

/**
 * Get the first marker in a marker sequence.
 *
 * @internal
 *
 * @this {void}
 *
 * @param {MarkerSequence | MarkerSequence[0]} sequence
 *  The marker sequence to evaluate
 * @return {MarkerInfo}
 *  The info representing the first marker in `sequence`
 */
function firstMarker(
  this: void,
  sequence: MarkerSequence | MarkerSequence[0]
): MarkerInfo {
  if (Array.isArray(sequence)) return firstMarker(sequence[0])
  return typeof sequence === 'object' ? sequence : { code: sequence }
}

export default firstMarker

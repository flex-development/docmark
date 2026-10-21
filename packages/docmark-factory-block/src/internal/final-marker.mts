/**
 * @file Internal - finalMarker
 * @module docmark-factory-block/internal/finalMarker
 */

import type {
  MarkerInfo,
  MarkerSequence
} from '@flex-development/docmark-util-types'

/**
 * Get the last marker in a marker sequence.
 *
 * @internal
 *
 * @this {void}
 *
 * @param {MarkerSequence | MarkerSequence[0]} sequence
 *  The marker sequence to evaluate
 * @return {MarkerInfo}
 *  The info representing the last marker in `sequence`
 */
function finalMarker(this: void,
  sequence: MarkerSequence | MarkerSequence[0]): MarkerInfo {
  if (Array.isArray(sequence)) return finalMarker(sequence.at(-1)!)
  return typeof sequence === 'object' ? sequence : { code: sequence }
}

export default finalMarker

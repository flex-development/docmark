/**
 * @file Internal - normalize
 * @module docmark-factory-markers/internal/normalize
 */

import type { Info } from '@flex-development/docmark-factory-markers'
import type { Marker } from '@flex-development/docmark-util-types'

/**
 * Normalize a comment marker configuration.
 *
 * @internal
 *
 * @this {void}
 *
 * @param {Info | Marker} marker
 *  The marker configuration
 * @return {Info}
 *  The comment marker info
 */
function normalize(this: void, marker: Info | Marker): Info {
  return typeof marker === 'number' ? { code: marker } : marker
}

export default normalize

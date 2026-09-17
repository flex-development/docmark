/**
 * @file Utilities - normalize
 * @module docmark-factory-markers/utils/normalize
 */

import type { Info } from '@flex-development/docmark-factory-markers'
import type { Marker } from '@flex-development/docmark-util-types'

/**
 * Normalize a comment marker configuration.
 *
 * @see {@linkcode Info}
 * @see {@linkcode Marker}
 *
 * @category
 *  utils
 *
 * @this {void}
 *
 * @param {Info | Marker} marker
 *  The marker info or code
 * @return {Info}
 *  The comment marker info
 */
function normalize(this: void, marker: Info | Marker): Info {
  return typeof marker === 'number' ? { code: marker } : marker
}

export default normalize

/**
 * @file Utilities - normalize
 * @module docmark-factory-markers/utils/normalize
 */

import type { Info } from '@flex-development/docmark-factory-markers'
import type { Marker } from '@flex-development/docmark-util-types'
import type { CodeCheck } from '@flex-development/mark/parse'

/**
 * Normalize a comment marker configuration.
 *
 * @see {@linkcode CodeCheck}
 * @see {@linkcode Info}
 * @see {@linkcode Marker}
 *
 * @category
 *  utils
 *
 * @this {void}
 *
 * @param {CodeCheck | Info | Marker} marker
 *  The comment marker matcher, info object, or code
 * @return {Info}
 *  The comment marker info object
 */
function normalize(this: void, marker: CodeCheck | Info | Marker): Info {
  return typeof marker === 'object' ? marker : { code: marker }
}

export default normalize

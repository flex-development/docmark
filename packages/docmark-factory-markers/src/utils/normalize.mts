/**
 * @file Utilities - normalize
 * @module docmark-factory-markers/utils/normalize
 */

import type { Marker, MarkerInfo } from '@flex-development/docmark-util-types'
import type { CodeCheck } from '@flex-development/mark/parse'

/**
 * Normalize a marker configuration.
 *
 * @see {@linkcode CodeCheck}
 * @see {@linkcode MarkerInfo}
 * @see {@linkcode Marker}
 *
 * @category
 *  utils
 *
 * @this {void}
 *
 * @param {CodeCheck | Marker | MarkerInfo} marker
 *  The marker matcher, info object, or code
 * @return {MarkerInfo}
 *  The marker info object
 */
function normalize(
  this: void,
  marker: CodeCheck | Marker | MarkerInfo
): MarkerInfo {
  return typeof marker === 'object' ? marker : { code: marker }
}

export default normalize

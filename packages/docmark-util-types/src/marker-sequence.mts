/**
 * @file MarkerSequence
 * @module docmark-util-types/MarkerSequence
 */

import type { Marker, MarkerInfo } from '@flex-development/docmark-util-types'
import type { CodeCheck } from '@flex-development/mark/parse'

/**
 * A marker info list.
 *
 * Each element specifies a marker to consume and, optionally, the token type to
 * emit for that marker.
 *
 * At least one element is required.
 *
 * @see {@linkcode CodeCheck}
 * @see {@linkcode MarkerInfo}
 * @see {@linkcode Marker}
 */
type MarkerSequence = [
  marker: CodeCheck | Marker | MarkerInfo,
  ...markers: (CodeCheck | Marker | MarkerInfo)[]
]

export type { MarkerSequence as default }

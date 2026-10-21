/**
 * @file Markers
 * @module docmark-util-types/Markers
 */

import type {
  Marker,
  MarkerInfo,
  MarkerSequence
} from '@flex-development/docmark-util-types'

/**
 * A marker info object, code, or sequence.
 *
 * @see {@linkcode MarkerInfo}
 * @see {@linkcode MarkerSequence}
 * @see {@linkcode Marker}
 */
type Markers = Marker | MarkerInfo | MarkerSequence

export type { Markers as default }

/**
 * @file Type Aliases - Sequence
 * @module docmark-factory-markers/types/Sequence
 */

import type { Info } from '@flex-development/docmark-factory-markers'
import type { Marker } from '@flex-development/docmark-util-types'
import type { CodeCheck } from '@flex-development/mark/parse'

/**
 * A comment marker info list.
 *
 * Each element specifies a marker to consume and, optionally, the token type to
 * emit for that marker.
 *
 * At least one element is required.
 *
 * @see {@linkcode CodeCheck}
 * @see {@linkcode Info}
 * @see {@linkcode Marker}
 */
type Sequence = [
  marker: CodeCheck | Info | Marker,
  ...markers: (CodeCheck | Info | Marker)[]
]

export type { Sequence as default }

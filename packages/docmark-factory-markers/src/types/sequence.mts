/**
 * @file Type Aliases - Sequence
 * @module docmark-factory-markers/types/Sequence
 */

import type { Info } from '@flex-development/docmark-factory-markers'
import type { Marker } from '@flex-development/docmark-util-types'

/**
 * A comment marker info list.
 *
 * Each element specifies a marker to consume and, optionally, the token type to
 * emit for that marker.
 *
 * At least one element is required.
 *
 * @see {@linkcode Info}
 * @see {@linkcode Marker}
 */
type Sequence = [marker: Info | Marker, ...markers: (Info | Marker)[]]

export type { Sequence as default }

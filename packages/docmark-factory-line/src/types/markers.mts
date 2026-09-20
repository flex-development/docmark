/**
 * @file Type Aliases - Markers
 * @module docmark-factory-line/types/Markers
 */

import type { Info, Sequence } from '@flex-development/docmark-factory-markers'
import type { Marker } from '@flex-development/docmark-util-types'

/**
 * A marker info object, code, or sequence.
 *
 * @see {@linkcode Info}
 * @see {@linkcode Marker}
 * @see {@linkcode Sequence}
 */
type Markers = Info | Marker | Sequence

export type { Markers as default }

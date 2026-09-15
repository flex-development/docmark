/**
 * @file Interfaces - Markers
 * @module docmark-factory-block/interfaces/Markers
 */

import type { Info, Sequence } from '@flex-development/docmark-factory-markers'
import type { Marker } from '@flex-development/docmark-util-types'

/**
 * Settings for configuring block comment markers.
 */
interface Markers {
  /**
   * The comment closer marker code, info, or sequence.
   *
   * @see {@linkcode Info}
   * @see {@linkcode Marker}
   * @see {@linkcode Sequence}
   */
  closer: Info | Marker | Sequence

  /**
   * The comment line marker code or info.
   *
   * @see {@linkcode Info}
   * @see {@linkcode Marker}
   */
  line: Info | Marker

  /**
   * The comment opener marker code, info, or sequence.
   *
   * @see {@linkcode Info}
   * @see {@linkcode Marker}
   * @see {@linkcode Sequence}
   */
  opener: Info | Marker | Sequence
}

export type { Markers as default }

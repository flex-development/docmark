/**
 * @file MarkersPack
 * @module docmark-util-types/MarkersPack
 */

import type {
  Marker,
  MarkerInfo,
  Markers
} from '@flex-development/docmark-util-types'

/**
 * Settings for a pack of markers (e.g. block comment markers).
 */
interface MarkersPack {
  /**
   * The closing marker code, info, or sequence.
   *
   * @see {@linkcode Markers}
   */
  closer: Markers

  /**
   * The line marker code or info.
   *
   * @see {@linkcode MarkerInfo}
   * @see {@linkcode Marker}
   */
  line?: Marker | MarkerInfo | undefined

  /**
   * The opening marker code, info, or sequence.
   *
   * @see {@linkcode Markers}
   */
  opener: Markers
}

export type { MarkersPack as default }

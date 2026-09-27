/**
 * @file Position
 * @module docmark-util-types/Position
 */

import type { Place } from '@flex-development/docmark-util-types'

/**
 * Range between two points in the source content.
 */
interface Position {
  /**
   * The place of the last character code in the range,
   * or simply the end of the range if it is empty.
   *
   * @see {@linkcode Place}
   */
  end: Place

  /**
   * The place of the first character code in the range,
   * or simply the start of the range if it is empty.
   *
   * @see {@linkcode Place}
   */
  start: Place
}

export type { Position as default }

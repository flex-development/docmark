/**
 * @file Place
 * @module docmark-util-types/Place
 */

import type { Point } from '@flex-development/docmark-util-types'

/**
 * A location in the source content (`line`/`column`/`offset`)
 * and chunk (`_index`, `_bufferIndex`).
 *
 * @see {@linkcode Point}
 *
 * @extends {Point}
 */
interface Place extends Point {
  /**
   * The position in a string chunk (or `-1` when pointing to a numeric chunk).
   */
  _bufferIndex: number

  /**
   * The position in a list of chunks.
   */
  _index: number
}

export type { Place as default }

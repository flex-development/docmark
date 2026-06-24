/**
 * @file SliceSerialize
 * @module docmark-util-types/SliceSerialize
 */

import type {
  Position,
  SerializeOptions
} from '@flex-development/docmark-util-types'

/**
 * Get the text spanning `range`.
 *
 * @see {@linkcode Position}
 * @see {@linkcode SerializeOptions}
 *
 * @this {void}
 *
 * @param {Position} range
 *  The position in stream
 * @param {SerializeOptions | boolean | null | undefined} [options]
 *  Options for serializing or whether to expand tabs
 * @return {string}
 *  The serialized slice
 */
type SliceSerialize = (
  this: void,
  range: Position,
  options?: SerializeOptions | boolean | null | undefined
) => string

export type { SliceSerialize as default }

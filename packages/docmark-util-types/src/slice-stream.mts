/**
 * @file SliceStream
 * @module docmark-util-types/SliceStream
 */

import type { Chunk, Position } from '@flex-development/docmark-util-types'

/**
 * Get the chunks spanning `range`.
 *
 * @see {@linkcode Chunk}
 * @see {@linkcode Position}
 *
 * @this {void}
 *
 * @param {Position} range
 *  The position in stream
 * @return {Chunk[]}
 *  The chunks in stream spanning `range`
 */
type SliceStream = (this: void, range: Position) => Chunk[]

export type { SliceStream as default }

/**
 * @file Write
 * @module docmark-util-types/Write
 */

import type { Chunk, Event } from '@flex-development/docmark-util-types'

/**
 * Write a slice of chunks.
 *
 * The eos code (`null`) can be used to signal end of stream.
 *
 * @see {@linkcode Chunk}
 * @see {@linkcode Event}
 *
 * @this {void}
 *
 * @param {Chunk[]} slice
 *  The list of chunks to write
 * @return {Event[]}
 *  The current list of events
 */
type Write = (this: void, slice: Chunk[]) => Event[]

export type { Write as default }

/**
 * @file Chunk
 * @module docmark-util-types/Chunk
 */

import type { Code } from '@flex-development/docmark-util-types'

/**
 * A character code or slice of a buffer in the form of a string.
 *
 * Chunks are used because strings are more efficient storage than character
 * codes, but limited in what they can represent.
 *
 * @see {@linkcode Code}
 */
type Chunk = Code | string

export type { Chunk as default }

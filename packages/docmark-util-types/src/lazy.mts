/**
 * @file Lazy
 * @module docmark-util-types/Lazy
 */

import type { Line } from '@flex-development/docmark-util-types'

/**
 * Record, where each key is a line number, and each value is a boolean
 * indicating if the line is lazy (as opposed to the line before it).
 *
 * For example:
 *
 * ```markdown
 * > a
 * b
 * ```
 *
 * L1 is not lazy, but L2 is.
 *
 * @see {@linkcode Line}
 */
type Lazy = { [line: Line]: boolean }

export type { Lazy as default }

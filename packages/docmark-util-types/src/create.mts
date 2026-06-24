/**
 * @file Create
 * @module docmark-util-types/Create
 */

import type {
  Point,
  TokenizeContext
} from '@flex-development/docmark-util-types'

/**
 * Create a tokenization context.
 *
 * @see {@linkcode Point}
 * @see {@linkcode TokenizeContext}
 *
 * @this {void}
 *
 * @param {Point | undefined} [from]
 *  Where to start parsing from
 * @return {TokenizeContext}
 *  The new tokenization context
 */
type Create = (this: void, from?: Point | undefined) => TokenizeContext

export type { Create as default }

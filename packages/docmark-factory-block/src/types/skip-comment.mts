/**
 * @file Type Aliases - SkipComment
 * @module docmark-factory-block/types/SkipComment
 */

import type { TokenizeContext } from '@flex-development/docmark-util-types'

/**
 * Check whether a block comment is allowed at the current position.
 *
 * @see {@linkcode TokenizeContext}
 *
 * @this {TokenizeContext}
 *
 * @return {boolean}
 *  Whether a block comment is not allowed
 */
type SkipComment = (this: TokenizeContext) => boolean

export type { SkipComment as default }

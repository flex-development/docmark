/**
 * @file SkipComment
 * @module docmark-util-types/SkipComment
 */

import type { TokenizeContext } from '@flex-development/docmark-util-types'

/**
 * Check whether a comment is allowed at the current position.
 *
 * @see {@linkcode TokenizeContext}
 *
 * @this {TokenizeContext}
 *
 * @return {boolean}
 *  Whether a comment is **not** allowed at the current position
 */
type SkipComment = (this: TokenizeContext) => boolean

export type { SkipComment as default }

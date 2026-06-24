/**
 * @file Previous
 * @module docmark-util-types/Previous
 */

import type {
  Code,
  TokenizeContext
} from '@flex-development/docmark-util-types'

/**
 * Check if the previous character `code` can precede a construct.
 *
 * > 👉 **Note**: A construct can hook into many potential start characters.
 * > Instead of setting up an attempt to parse that construct for most
 * > characters, this is a speedy way to reduce that.
 *
 * @see {@linkcode Code}
 * @see {@linkcode TokenizeContext}
 *
 * @this {TokenizeContext}
 *
 * @param {Code} code
 *  The previous character code
 * @return {boolean}
 *  Whether `code` is allowed before the construct
 */
type Previous = (this: TokenizeContext, code: Code) => boolean

export type { Previous as default }

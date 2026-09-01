/**
 * @file FinalizeContext
 * @module docmark-util-types/FinalizeContext
 */

import type { TokenizeContext } from '@flex-development/docmark-util-types'

/**
 * Finalize the tokenization context.
 *
 * @see {@linkcode TokenizeContext}
 *
 * @this {void}
 *
 * @param {TokenizeContext} context
 *  The current tokenization context
 * @return {undefined}
 */
type FinalizeContext = (this: void, context: TokenizeContext) => undefined

export type { FinalizeContext as default }

/**
 * @file CreateMarkersPack
 * @module docmark-util-types/CreateMarkersPack
 */

import type {
  MarkersPack,
  TokenizeContext
} from '@flex-development/docmark-util-types'

/**
 * Create a markers pack.
 *
 * @see {@linkcode MarkersPack}
 * @see {@linkcode TokenizeContext}
 *
 * @this {TokenizeContext}
 *
 * @return {MarkersPack}
 *  The markers configuration
 */
type CreateMarkersPack = (this: TokenizeContext) => MarkersPack

export type { CreateMarkersPack as default }

/**
 * @file Type Aliases - CreateFields
 * @module docmark-factory-block/types/CreateFields
 */

import type {
  TokenFields,
  TokenizeContext
} from '@flex-development/docmark-util-types'

/**
 * Create a token fields object.
 *
 * @see {@linkcode TokenFields}
 * @see {@linkcode TokenizeContext}
 *
 * @this {TokenizeContext}
 *
 * @return {TokenFields}
 *  The token fields
 */
type CreateFields = (this: TokenizeContext) => TokenFields

export type { CreateFields as default }

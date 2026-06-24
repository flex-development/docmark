/**
 * @file Enter
 * @module docmark-util-types/Enter
 */

import type {
  Token,
  TokenFields,
  TokenType
} from '@flex-development/docmark-util-types'

/**
 * Start a new token.
 *
 * @see {@linkcode TokenFields}
 * @see {@linkcode TokenType}
 * @see {@linkcode Token}
 *
 * @this {void}
 *
 * @param {TokenType} type
 *  The token type
 * @param {TokenFields | undefined} [fields]
 *  The token fields
 * @return {Token}
 *  The open token
 */
type Enter = (
  this: void,
  type: TokenType,
  fields?: TokenFields | undefined
) => Token

export type { Enter as default }

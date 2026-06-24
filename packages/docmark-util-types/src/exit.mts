/**
 * @file Exit
 * @module docmark-util-types/Exit
 */

import type { Token, TokenType } from '@flex-development/docmark-util-types'

/**
 * Close an open token.
 *
 * @see {@linkcode TokenType}
 * @see {@linkcode Token}
 *
 * @this {void}
 *
 * @param {TokenType} type
 *  The token type
 * @return {Token}
 *  The closed token
 */
type Exit = (this: void, type: TokenType) => Token

export type { Exit as default }

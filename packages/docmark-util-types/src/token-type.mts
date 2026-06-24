/**
 * @file TokenType
 * @module docmark-util-types/TokenType
 */

import type { TokenTypeMap } from '@flex-development/docmark-util-types'

/**
 * Union of registered token types.
 *
 * The token type `null` is forbidden.
 * The `mark` ecosystem uses the `null` key to support additional functionality.
 *
 * To register custom token types, augment {@linkcode TokenTypeMap}.
 * They will be added to this union automatically.
 */
type TokenType = TokenTypeMap[keyof TokenTypeMap]

export type { TokenType as default }

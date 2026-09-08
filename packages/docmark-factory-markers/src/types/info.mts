/**
 * @file Type Aliases - Info
 * @module docmark-factory-markers/types/Info
 */

import type { Marker, TokenType } from '@flex-development/docmark-util-types'

/**
 * Info about how to tokenize a comment marker.
 *
 * The first item is the character code to consume.\
 * The second, and last, item is the token type to emit for that character.
 *
 * If `type` is omitted, `tt.commentMarker` is used.
 *
 * @see {@linkcode Marker}
 * @see {@linkcode TokenType}
 */
type Info = [marker: Marker, type?: TokenType | undefined]

export type { Info as default }

/**
 * @file Type Aliases - Info
 * @module docmark-factory-markers/types/Info
 */

import type {
  Marker,
  TokenFields,
  TokenType
} from '@flex-development/docmark-util-types'

/**
 * Info about how to tokenize a comment marker.
 *
 * The first item is the character code to consume.\
 * The second item is the token type to emit for that character.\
 * The third item is the fields to attach to the emitted token.\
 * The fourth, and last, item indicates whether the marker is required.
 *
 * If `type` is omitted, `tt.commentMarker` is used.\
 * If `mandatory` is omitted, `marker` is considered required.
 * If `null`, an unexpected marker successfully terminates the marker sequence.
 *
 * @see {@linkcode Marker}
 * @see {@linkcode TokenFields}
 * @see {@linkcode TokenType}
 */
type Info = [
  marker: Marker,
  type?: TokenType | undefined,
  fields?: TokenFields | undefined,
  mandatory?: null | undefined
]

export type { Info as default }

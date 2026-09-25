/**
 * @file Interfaces - Info
 * @module docmark-factory-markers/interfaces/Info
 */

import type { tt } from '@flex-development/docmark-util-symbol'
import type {
  Marker,
  TokenFields,
  TokenType
} from '@flex-development/docmark-util-types'
import type { CodeCheck } from '@flex-development/mark/parse'

/**
 * Info about how to tokenize a comment marker.
 */
interface Info {
  /**
   * The character code to consume or the character code matcher.
   *
   * @see {@linkcode CodeCheck}
   * @see {@linkcode Marker}
   */
  code: CodeCheck | Marker

  /**
   * The fields to attach to the emitted token.
   *
   * @see {@linkcode TokenFields}
   */
  fields?: TokenFields | null | undefined

  /**
   * Whether the comment marker is not required.
   *
   * If `true`, an unexpected code successfully terminates the marker sequence.
   */
  optional?: boolean | undefined

  /**
   * The token type to emit when {@linkcode code} is consumed.
   *
   * If `type` is `undefined`, {@linkcode tt.commentMarker} is used.\
   * If `null`, `code` is consumed without emitting a token.
   *
   * @see {@linkcode TokenType}
   */
  type?: TokenType | null | undefined
}

export type { Info as default }

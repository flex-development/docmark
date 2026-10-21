/**
 * @file MarkerInfo
 * @module docmark-util-types/MarkerInfo
 */

import type {
  Marker,
  TokenFields,
  TokenType
} from '@flex-development/docmark-util-types'
import type { CodeCheck } from '@flex-development/mark/parse'

/**
 * Info about how to tokenize a {@linkcode Marker}.
 */
interface MarkerInfo {
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
   * Whether the comment marker is optional.
   *
   * If `true`, an unexpected code successfully terminates the marker sequence.
   */
  optional?: boolean | null | undefined

  /**
   * The token type to emit when {@linkcode code}, or the character code matched
   * by `code`, is consumed.
   *
   * If `null`, `code` is consumed without emitting a token.
   *
   * @see {@linkcode TokenType}
   */
  type?: TokenType | null | undefined
}

export type { MarkerInfo as default }

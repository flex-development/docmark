/**
 * @file ContainerState
 * @module docmark-util-types/ContainerState
 */

import type { Marker, Token } from '@flex-development/docmark-util-types'
import type * as micromark from 'micromark-util-types'

/**
 * State shared between container calls.
 *
 * This interface can be augmented to register custom fields.
 *
 * @example
 *  declare module '@flex-development/docmark-util-types' {
 *    interface ContainerState {
 *      markdownIndent?: boolean | null | undefined
 *    }
 *  }
 *
 * @see {@linkcode micromark.ContainerState}
 *
 * @extends {micromark.ContainerState}
 */
interface ContainerState extends micromark.ContainerState {
  /**
   * For comments, the token representing the active comment.
   *
   * The comment token is captured at the `comments` level after a new comment
   * has just been entered.\
   * The token is extracted from the first event produced by the current comment
   * construct.
   */
  comment?: Token | undefined

  /**
   * For comments, the token representing the comment opener.
   *
   * By default, this is a `commentOpener` token.
   *
   * Comment openers are a specific sequence of {@linkcode Marker} (non-`null`
   * character codes), unique to the surrounding source language, used to signal
   * the beginning of a comment.
   *
   * Marker sequences for block comment openers are unique in comparison to
   * their comment closer and comment line sequences.
   *
   * For line comments, the beginning sequence *is* the comment opener.\
   * Further sequences are considered part of the current comment line prefix.
   * When indented syntax is disabled, markers on continued lines are expected
   * to match the sequence established by `opener`.
   *
   * @see {@linkcode Token}
   */
  opener?: Token | undefined

  /**
   * The width of the comment opener ({@linkcode ContainerState.opener}).
   *
   * Opener width is the difference between `end` and `start` columns.
   *
   * When a comment is active and indented syntax is enabled, opener width is
   * used to derive the expected indentation of a candidate continuation line.
   *
   * Before any whitespace can be treated as a marker sequence, a line comment's
   * candidate line must have leading comment padding that ends directly below
   * the active opener. For block comments, leading comment padding must align
   * with the middle marker of the active opener. After accounting for opener
   * alignment, at least one whitespace is required to form the line's indent.
   */
  openerWidth?: number | undefined
}

export type { ContainerState as default }

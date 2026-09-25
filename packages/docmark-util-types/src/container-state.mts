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
 *      custom?: boolean | null | undefined
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
   * The comment token is captured at the `source` level after a new comment has
   * just been entered.\
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
   * to match the sequence established by the comment opener.
   *
   * @see {@linkcode Token}
   */
  opener?: Token | undefined

  /**
   * The width of the comment opener ({@linkcode ContainerState#opener}).
   *
   * Opener width is the difference between `end` and `start` columns.
   *
   * When a comment is active and indented syntax is enabled, opener width is
   * used to calculate the expected leading padding and maximum indentation of a
   * candidate continuation line.
   *
   * To consider a block or line comment candidate line indented, the line must:
   *
   * - **not** be considered marked,\
   *   i.e. **not** start with a `commentLinePrefix` that satisfies the default,
   *   non-whitespace line marker expectation
   *
   * In addition to being unmarked, a line comment's candidate line must:
   *
   * - be aligned with active comment's opener,\
   *   i.e. leading comment padding ending ***directly below*** the opener.\
   *   such padding is said to end "directly below" the active opener when
   *   it begins at least one line after the opener, and the end column of the
   *   relevant `commentPadding` token is equal to the opener's start column
   * - start with at least one whitespace after accounting for opener alignment
   *
   * @todo block comment specific criteria for continued indented lines
   */
  openerWidth?: number | undefined
}

export type { ContainerState as default }

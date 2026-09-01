/**
 * @file ContainerState
 * @module docmark-util-types/ContainerState
 */

import type {
  CommentKind,
  TokenFields
} from '@flex-development/docmark-util-types'
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
   * The current comment kind.
   *
   * The comment kind is captured at the `source` level after a comment has just
   * been entered.\
   * The kind ({@linkcode TokenFields._kind}) is extracted from the first event
   * produced by the current comment construct.
   *
   * @see {@linkcode CommentKind}
   */
  comment?: CommentKind | undefined
}

export type { ContainerState as default }

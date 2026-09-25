/**
 * @file Interfaces - Options
 * @module docmark-factory-block/interfaces/Options
 */

import type {
  AllowIndentedLines,
  CreateMarkers,
  FinalizeConstruct,
  Markers
} from '@flex-development/docmark-factory-block'
import type {
  Construct,
  CreateFields,
  TokenFields
} from '@flex-development/docmark-util-types'
import type { whitespace } from '@flex-development/mark-util-character'

/**
 * Options for creating a block comment construct.
 */
interface Options {
  /**
   * Whether continued lines can be indented in lieu of an explicit line marker,
   * or a function that returns a boolean indicating as such.
   *
   * A continued line is any line after that first line of an active comment.\
   * When indented syntax is enabled, the line marker for a continued line is
   * any character code satisfying the {@linkcode whitespace} predicate.
   *
   * @see {@linkcode AllowIndentedLines}
   */
  allowIndentedContinuation?: AllowIndentedLines | boolean | undefined

  /**
   * Additional construct info.
   *
   * > 👉 **Note**: The construct's `continuation` and `tokenize` properties
   * > will be overridden.\
   * > The `exit` hook is called before the factory's `exit` hook exits the
   * > block comment.
   *
   * @see {@linkcode Construct}
   */
  construct?: Partial<Construct> | null | undefined

  /**
   * Additional `comment` token fields,
   * or a function that returns the token fields object.
   *
   * Fields are applied when the token is `enter`ed.
   *
   * @see {@linkcode CreateFields}
   * @see {@linkcode TokenFields}
   */
  fields?: CreateFields | TokenFields | null | undefined

  /**
   * Finalize the block comment construct.
   *
   * @see {@linkcode FinalizeConstruct}
   */
  finalizeConstruct?: FinalizeConstruct | null | undefined

  /**
   * The markers configuration, or a function that returns the configuration.
   *
   * @see {@linkcode CreateMarkers}
   * @see {@linkcode Markers}
   */
  markers: CreateMarkers | Markers
}

export type { Options as default }

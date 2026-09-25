/**
 * @file Interfaces - Options
 * @module docmark-factory-line/interfaces/Options
 */

import type {
  AllowIndentedLines,
  CreateMarkers,
  FinalizeConstruct,
  Markers
} from '@flex-development/docmark-factory-line'
import type {
  Construct,
  CreateFields,
  TokenFields
} from '@flex-development/docmark-util-types'
import type { whitespace } from '@flex-development/mark-util-character'

/**
 * Options for creating a line comment construct.
 */
interface Options {
  /**
   * Whether continued lines can be indented in lieu of explicit line markers,
   * or a function that returns a boolean indicating as such.
   *
   * A continued line is any line after that first line of an active comment.\
   * When indented syntax is enabled, line markers for a continued line are any
   * character codes satisfying the {@linkcode whitespace} predicate.
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
   * > line comment.
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
   * Finalize the line comment construct.
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

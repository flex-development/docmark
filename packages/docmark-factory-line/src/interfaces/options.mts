/**
 * @file Interfaces - Options
 * @module docmark-factory-line/interfaces/Options
 */

import type { Sequence } from '@flex-development/docmark-factory-markers'
import type {
  Construct,
  Marker,
  TokenFields
} from '@flex-development/docmark-util-types'

/**
 * Options for creating a line comment construct.
 */
interface Options {
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
   * Additional `comment` token fields.
   *
   * @see {@linkcode TokenFields}
   */
  fields?: TokenFields | null | undefined

  /**
   * The comment line marker or marker sequence.
   *
   * @see {@linkcode Marker}
   * @see {@linkcode Sequence}
   */
  markers: Marker | Sequence
}

export type { Options as default }

/**
 * @file Interfaces - Options
 * @module docmark-factory-block/interfaces/Options
 */

import type {
  CreateMarkers,
  Markers
} from '@flex-development/docmark-factory-block'
import type {
  Construct,
  TokenFields
} from '@flex-development/docmark-util-types'

/**
 * Options for creating a block comment construct.
 */
interface Options {
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
   * Additional `comment` token fields.
   *
   * @see {@linkcode TokenFields}
   */
  fields?: TokenFields | null | undefined

  /**
   * The markers configuration, or a function that returns the configuration.
   *
   * @see {@linkcode CreateMarkers}
   * @see {@linkcode Markers}
   */
  markers: CreateMarkers | Markers
}

export type { Options as default }

/**
 * @file Interfaces - NamedOptions
 * @module docmark-factory-block/interfaces/NamedOptions
 */

import type {
  ConstructWithName,
  Options
} from '@flex-development/docmark-factory-block'

/**
 * Options for creating a named block comment construct.
 *
 * @extends {Options}
 */
interface NamedOptions extends Options {
  /**
   * Additional construct info.
   *
   * > 👉 **Note**: The construct's `continuation` and `tokenize` properties
   * > will be overridden.\
   * > The `exit` hook is called before the factory's `exit` hook exits the
   * > block comment.
   *
   * @see {@linkcode ConstructWithName}
   *
   * @override
   */
  construct: ConstructWithName
}

export type { NamedOptions as default }

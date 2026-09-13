/**
 * @file Interfaces - NamedOptions
 * @module docmark-factory-line/interfaces/NamedOptions
 */

import type {
  ConstructWithName,
  Options
} from '@flex-development/docmark-factory-line'

/**
 * Options for creating a named line comment construct.
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
   * > line comment.
   *
   * @see {@linkcode ConstructWithName}
   *
   * @override
   */
  construct: ConstructWithName
}

export type { NamedOptions as default }

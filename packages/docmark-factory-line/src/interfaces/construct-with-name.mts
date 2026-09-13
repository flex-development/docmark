/**
 * @file Interfaces - ConstructWithName
 * @module docmark-factory-line/interfaces/ConstructWithName
 */

import type { NamedConstruct } from '@flex-development/docmark-util-types'

/**
 * A construct with a name.
 *
 * @see {@linkcode NamedConstruct}
 *
 * @extends {Partial<NamedConstruct>}
 */
interface ConstructWithName extends Partial<NamedConstruct> {
  /**
   * The name of the construct.
   *
   * @override
   */
  name: string
}

export type { ConstructWithName as default }

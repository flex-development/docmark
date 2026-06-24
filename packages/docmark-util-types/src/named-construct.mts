/**
 * @file NamedConstruct
 * @module docmark-util-types/NamedConstruct
 */

import type { Construct } from '@flex-development/docmark-util-types'

/**
 * A construct with a name.
 *
 * @see {@linkcode Construct}
 *
 * @extends {Construct}
 */
interface NamedConstruct extends Construct {
  /**
   * The name of the construct.
   *
   * @override
   */
  name: string
}

export type { NamedConstruct as default }

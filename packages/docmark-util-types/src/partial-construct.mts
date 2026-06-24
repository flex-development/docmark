/**
 * @file PartialConstruct
 * @module docmark-util-types/PartialConstruct
 */

import type { Construct } from '@flex-development/docmark-util-types'

/**
 * A partial construct.
 *
 * @see {@linkcode Construct}
 *
 * @extends {Construct}
 */
interface PartialConstruct extends Construct {
  /**
   * Whether the construct represents a partial construct.
   *
   * @override
   */
  partial: true
}

export type { PartialConstruct as default }

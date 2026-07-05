/**
 * @file ContinuableConstruct
 * @module docmark-util-types/ContinuableConstruct
 */

import type { Construct } from '@flex-development/docmark-util-types'

/**
 * A construct that can be continued.
 *
 * @see {@linkcode Construct}
 *
 * @extends {Construct}
 */
interface ContinuableConstruct extends Construct {
  /**
   * The continuation construct.
   *
   * @see {@linkcode Construct}
   *
   * @override
   */
  continuation: Construct
}

export type { ContinuableConstruct as default }

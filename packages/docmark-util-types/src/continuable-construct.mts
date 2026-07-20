/**
 * @file ContinuableConstruct
 * @module docmark-util-types/ContinuableConstruct
 */

import type { Construct, Exiter } from '@flex-development/docmark-util-types'

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

  /**
   * For containers, a final exit hook.
   *
   * @see {@linkcode Exiter}
   *
   * @override
   */
  exit: Exiter
}

export type { ContinuableConstruct as default }

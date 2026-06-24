/**
 * @file InsideSpan
 * @module docmark-util-types/InsideSpan
 */

import type { Construct } from '@flex-development/docmark-util-types'

/**
 * Resolvers to run inside a span.
 */
interface InsideSpan {
  /**
   * The list of resolvers to run.
   *
   * @see {@linkcode Construct}
   */
  null?: Pick<Construct, 'resolveAll'>[] | undefined
}

export type { InsideSpan as default }

/**
 * @file InsideSpan
 * @module docmark-util-types/InsideSpan
 */

import type { AnyConstruct } from '@flex-development/docmark-util-types'

/**
 * Resolvers to run after inline markdown text has been parsed.
 */
interface InsideSpan {
  /**
   * The list of resolvers to run.
   *
   * @see {@linkcode AnyConstruct}
   */
  null?: Pick<AnyConstruct, 'resolveAll'>[] | undefined
}

export type { InsideSpan as default }

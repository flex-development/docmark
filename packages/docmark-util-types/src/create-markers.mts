/**
 * @file CreateMarkers
 * @module docmark-util-types/CreateMarkers
 */

import type {
  Markers,
  TokenizeContext
} from '@flex-development/docmark-util-types'

/**
 * Create a markers configuration.
 *
 * @see {@linkcode Markers}
 * @see {@linkcode TokenizeContext}
 *
 * @this {TokenizeContext}
 *
 * @return {Markers}
 *  The marker info object, code, or sequence
 */
type CreateMarkers = (this: TokenizeContext) => Markers

export type { CreateMarkers as default }

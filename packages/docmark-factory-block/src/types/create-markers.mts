/**
 * @file Type Aliases - CreateMarkers
 * @module docmark-factory-block/types/CreateMarkers
 */

import type { Markers } from '@flex-development/docmark-factory-block'
import type { TokenizeContext } from '@flex-development/docmark-util-types'

/**
 * Create a markers configuration.
 *
 * @see {@linkcode Markers}
 * @see {@linkcode TokenizeContext}
 *
 * @this {TokenizeContext}
 *
 * @return {Markers}
 *  The markers configuration
 */
type CreateMarkers = (this: TokenizeContext) => Markers

export type { CreateMarkers as default }

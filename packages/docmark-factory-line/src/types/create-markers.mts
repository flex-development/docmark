/**
 * @file Type Aliases - CreateMarkers
 * @module docmark-factory-line/types/CreateMarkers
 */

import type { Markers } from '@flex-development/docmark-factory-line'
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
 *  The marker info object, code, or sequence
 */
type CreateMarkers = (this: TokenizeContext) => Markers

export type { CreateMarkers as default }

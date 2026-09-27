/**
 * @file ConstructPack
 * @module docmark-util-types/ConstructPack
 */

import type { AnyConstruct } from '@flex-development/docmark-util-types'

/**
 * A `docmark` or `micromark` construct, or a list of constructs.
 *
 * @see {@linkcode AnyConstruct}
 */
type ConstructPack = AnyConstruct | AnyConstruct[]

export type { ConstructPack as default }

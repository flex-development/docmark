/**
 * @file ConstructPosition
 * @module docmark-util-types/ConstructPosition
 */

import type { ConstructRecord } from '@flex-development/docmark-util-types'

/**
 * Union of construct positions.
 *
 * Positions determine whether a construct,
 * when in a {@linkcode ConstructRecord}, takes precedence over existing
 * constructs for the same character code when merged.
 */
type ConstructPosition = 'after' | 'before'

export type { ConstructPosition as default }

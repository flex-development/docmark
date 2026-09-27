/**
 * @file ConstructPosition
 * @module docmark-util-types/ConstructPosition
 */

import type { ConstructRecord } from '@flex-development/docmark-util-types'

/**
 * The position of construct when merging into a {@linkcode ConstructRecord}.
 *
 * Construct positions determine whether a construct takes precedence over
 * existing constructs for the same character code when merged.
 */
type ConstructPosition = 'after' | 'before'

export type { ConstructPosition as default }

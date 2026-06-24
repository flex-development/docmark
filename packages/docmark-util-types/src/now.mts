/**
 * @file Now
 * @module docmark-util-types/Now
 */

import type { Place } from '@flex-development/docmark-util-types'

/**
 * Get the current place in the content.
 *
 * @see {@linkcode Place}
 *
 * @this {void}
 *
 * @return {Place}
 *  The current place
 */
type Now = (this: void) => Place

export type { Now as default }

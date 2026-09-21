/**
 * @file Mode
 * @module docmark-util-types/Mode
 */

import type { ModeMap } from '@flex-development/docmark-util-types'

/**
 * Union of registered comment parsing modes.
 *
 * To register custom modes, augment {@linkcode ModeMap}.\
 * They will be added to this union automatically.
 */
type Mode = ModeMap[keyof ModeMap]

export type { Mode as default }

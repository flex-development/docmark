/**
 * @file FullNormalizedExtension
 * @module docmark-util-types/FullNormalizedExtension
 */

import type { Extension } from '@flex-development/docmark-util-types'

/**
 * A full, filtered, and normalized extension, where all properties are required
 * and defined.
 *
 * @see {@linkcode Extension}
 */
type FullNormalizedExtension = {
  [K in keyof Extension]-?: Exclude<Extension[K], null | undefined>
}

export type { FullNormalizedExtension as default }

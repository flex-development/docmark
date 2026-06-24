/**
 * @file NormalizedExtension
 * @module docmark-util-types/NormalizedExtension
 */

import type { Extension } from '@flex-development/docmark-util-types'

/**
 * A filtered, combined extension, where all properties of {@linkcode Extension}
 * are optional, but defined.
 */
type NormalizedExtension = {
  [Key in keyof Extension]: Exclude<Extension[Key], null | undefined>
}

export type { NormalizedExtension as default }

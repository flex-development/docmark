/**
 * @file LanguageSettings
 * @module docmark-util-types/LanguageSettings
 */

import type {
  Language,
  LanguageOptions
} from '@flex-development/docmark-util-types'

/**
 * Record, where each key is a {@linkcode Language}
 * and each value is a {@linkcode LanguageOptions} object.
 *
 * To register custom language identifiers, augment {@linkcode LanguageMap}.\
 * They will be added to this union automatically.
 */
type LanguageSettings = {
  [Lang in Language]?: LanguageOptions | null | undefined
}

export type { LanguageSettings as default }

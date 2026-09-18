/**
 * @file Language
 * @module docmark-util-types/Language
 */

import type { LanguageMap } from '@flex-development/docmark-util-types'

/**
 * Union of registered source language identifiers.
 *
 * To register custom language identifiers, augment {@linkcode LanguageMap}.\
 * They will be added to this union automatically.
 */
type Language = LanguageMap[keyof LanguageMap]

export type { Language as default }

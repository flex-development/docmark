/**
 * @file Settings
 * @module docmark-util-types/Settings
 */

import type { LanguageSettings } from '@flex-development/docmark-util-types'

/**
 * Additional extension settings.
 *
 * Language-specific options are inherited from {@linkcode LanguageSettings}.
 *
 * This interface can be augmented to register global settings
 * or override already-registered language-specific settings.
 *
 * @example
 *  declare module '@flex-development/docmark-util-types' {
 *    interface Settings {
 *      javascript?: JsOptions
 *    }
 *  }
 *
 * @see {@linkcode LanguageSettings}
 *
 * @extends {LanguageSettings}
 */
interface Settings extends LanguageSettings {}

export type { Settings as default }

/**
 * @file Settings
 * @module docmark-util-types/Settings
 */

import type { LanguageSettings } from '@flex-development/docmark-util-types'

/**
 * Additional extension settings.
 *
 * This interface can be augmented to register custom settings.
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

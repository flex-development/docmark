/**
 * @file Settings
 * @module docmark-util-types/Settings
 */

import type {
  LanguageSettings,
  Modes
} from '@flex-development/docmark-util-types'

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
interface Settings extends LanguageSettings {
  /**
   * Record where each key is a registered comment kind
   * and each value is a registered comment parsing mode.
   *
   * @see {@linkcode Modes}
   */
  modes?: Modes | undefined
}

export type { Settings as default }

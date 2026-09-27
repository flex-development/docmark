/**
 * @file LanguageOptions
 * @module docmark-util-types/LanguageOptions
 */

/**
 * Base options for language-specific settings.
 *
 * This interface can be augmented to register custom options,
 * or extended to create language-specific options.
 *
 * @example
 *  declare module '@flex-development/docmark-util-types' {
 *    interface LanguageOptions {
 *      codeTags?: string[] | undefined
 *    }
 *  }
 *
 * @example
 *  import type { LanguageOptions } from '@flex-development/docmark-util-types'
 *
 *  export interface MyLanguageOptions extends LanguageOptions {
 *    documentationOnly?: boolean | undefined
 *  }
 *
 *  declare module '@flex-development/docmark-util-types' {
 *    interface Settings {
 *      lang?: MyLanguageOptions
 *    }
 *  }
 */
interface LanguageOptions {
  /**
   * Whether indented syntax is enabled.
   */
  indented?: boolean | null | undefined
}

export type { LanguageOptions as default }

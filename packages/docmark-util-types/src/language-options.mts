/**
 * @file LanguageOptions
 * @module docmark-util-types/LanguageOptions
 */

/**
 * Global language-based options.
 *
 * This interface can be augmented to register custom options.
 *
 * @example
 *  declare module '@flex-development/docmark-util-types' {
 *    interface LanguageOptions {
 *      codeTags?: string[] | undefined
 *    }
 *  }
 */
interface LanguageOptions {}

export type { LanguageOptions as default }

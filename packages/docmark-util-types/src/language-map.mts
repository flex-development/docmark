/**
 * @file LanguageMap
 * @module docmark-util-types/LanguageMap
 */

/**
 * Registry of source languages.
 *
 * This interface can be augmented to register custom languages.
 *
 * @example
 *  declare module '@flex-development/docmark-util-types' {
 *    interface LanguageMap {
 *      rust: 'rust'
 *    }
 *  }
 */
interface LanguageMap {
  css: 'css'
  javascript: 'js'
  jsonc: 'jsonc'
  markdown: 'md'
  mdx: 'mdx'

  /**
   * Forbidden language id.
   *
   * The ecosystem uses the `null` key to support additional functionality.
   */
  null: never

  sass: 'sass'
  shell: 'shell'
  typescript: 'ts'
  yaml: 'yaml'
}

export type { LanguageMap as default }

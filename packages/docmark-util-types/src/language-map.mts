/**
 * @file LanguageMap
 * @module docmark-util-types/LanguageMap
 */

/**
 * Registry of source language identifiers.
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
  html: 'html'
  javascript: 'javascript'
  json5: 'json5'
  jsonc: 'jsonc'
  markdown: 'markdown'
  mdx: 'mdx'

  /**
   * Forbidden language id.
   *
   * The ecosystem uses the `null` key to support additional functionality.
   */
  null: never

  sass: 'sass'
  scss: 'scss'
  shell: 'shell'
  typescript: 'typescript'
  xml: 'xml'
  yaml: 'yaml'
}

export type { LanguageMap as default }

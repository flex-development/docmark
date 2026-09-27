/**
 * @file lang
 * @module docmark-util-symbol/lang
 */

/**
 * The source language identifier dictionary.
 *
 * @enum {Lowercase<string> | null}
 */
const lang = {
  css: 'css',
  html: 'html',
  javascript: 'javascript',
  json5: 'json5',
  jsonc: 'jsonc',
  markdown: 'markdown',
  mdx: 'mdx',
  null: null,
  sass: 'sass',
  shell: 'shell',
  typescript: 'typescript',
  xml: 'xml',
  yaml: 'yaml'
} as const

export default lang

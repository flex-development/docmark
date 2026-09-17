/**
 * @file lang
 * @module docmark-util-symbol/lang
 */

/**
 * Registry of source languages.
 *
 * @enum {Lowercase<string> | null}
 */
const lang = {
  css: 'css',
  html: 'html',
  javascript: 'js',
  jsonc: 'jsonc',
  markdown: 'md',
  mdx: 'mdx',
  null: null,
  sass: 'sass',
  shell: 'shell',
  typescript: 'ts',
  xml: 'xml',
  yaml: 'yaml'
} as const

export default lang

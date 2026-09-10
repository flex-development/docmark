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
  javascript: 'js',
  jsonc: 'jsonc',
  markdown: 'md',
  mdx: 'mdx',
  null: null,
  shell: 'shell',
  typescript: 'ts',
  yaml: 'yaml'
} as const

export default lang

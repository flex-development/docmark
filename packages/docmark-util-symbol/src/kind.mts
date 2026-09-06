/**
 * @file kind
 * @module docmark-util-symbol/kind
 */

/**
 * Registry of all comment kinds exposed by docmark.
 *
 * @enum {string}
 */
const kind = {
  block: 'block',
  docblock: 'docblock',
  hash: 'hash',
  hashbang: 'hashbang',
  line: 'line'
} as const

export default kind

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
  docblock: 'block:doc',
  docslash: 'slash:doc',
  hash: 'hash',
  hashbang: 'hashbang',
  slash: 'slash'
} as const

export default kind

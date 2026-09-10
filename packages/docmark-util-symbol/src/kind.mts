/**
 * @file kind
 * @module docmark-util-symbol/kind
 */

/**
 * Registry of all comment kinds exposed by docmark.
 *
 * @enum {Lowercase<string>}
 */
const kind = {
  block: 'block',
  hashbang: 'hashbang',
  line: 'line'
} as const

export default kind

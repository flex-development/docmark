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
  line: 'line'
} as const

export default kind

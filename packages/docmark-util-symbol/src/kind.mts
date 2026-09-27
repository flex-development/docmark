/**
 * @file kind
 * @module docmark-util-symbol/kind
 */

/**
 * The comment kind dictionary.
 *
 * @enum {Lowercase<string>}
 */
const kind = { block: 'block', hashbang: 'hashbang', line: 'line' } as const

export default kind

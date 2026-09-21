/**
 * @file mode
 * @module docmark-util-symbol/mode
 */

/**
 * Registry of comment parsing modes.
 *
 * @enum {Lowercase<string> | null}
 */
const mode = {
  documentation: 'documentation',
  null: null
} as const

export default mode

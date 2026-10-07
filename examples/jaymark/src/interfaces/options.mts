/**
 * @file Interfaces - Options
 * @module examples/jaymark/interfaces/Options
 */

/**
 * Options for parsing.
 */
interface Options {
  /**
   * Whether comments are allowed.
   */
  comments?: boolean | null | undefined

  /**
   * Whether docblocks are supported.
   */
  docs?: boolean | null | undefined
}

export type { Options as default }

/**
 * @file ParseContext
 * @module docmark-util-types/ParseContext
 */

import type {
  Create,
  FullNormalizedExtension,
  Lazy
} from '@flex-development/docmark-util-types'

/**
 * Context object to assist with parsing.
 *
 * This interface can be augmented to register custom fields.
 *
 * @example
 *  declare module '@flex-development/docmark-util-types' {
 *    interface ParseContext {
 *      list: string[]
 *    }
 *  }
 */
interface ParseContext {
  /**
   * Whether the current line is blank.
   */
  atBlankLine?: boolean | null | undefined

  /**
   * Create a comment content parser.
   *
   * @see {@linkcode Create}
   */
  comment: Create

  /**
   * The normalized syntax extension.
   *
   * @see {@linkcode FullNormalizedExtension}
   */
  constructs: FullNormalizedExtension

  /**
   * Create a markdown content parser.
   *
   * @see {@linkcode Create}
   */
  content: Create

  /**
   * The list of defined markdown identifiers.
   */
  defined: string[]

  /**
   * Create a markdown document parser.
   *
   * @see {@linkcode Create}
   */
  document: Create

  /**
   * Create a markdown flow parser.
   *
   * @see {@linkcode Create}
   */
  flow: Create

  /**
   * Whether a comment was just added.
   */
  freshComment?: boolean | null | undefined

  /**
   * Whether a comment region was just added.
   */
  freshRegion?: boolean | null | undefined

  /**
   * At the `document` level, a record where each key is a line number, and each
   * value is a boolean indicating if the line is lazy (as opposed to the line
   * before it).
   *
   * For example:
   *
   * ```markdown
   * > a
   * b
   * ```
   *
   * L1 is not lazy, but L2 is.
   *
   * @see {@linkcode Lazy}
   */
  lazy: Lazy

  /**
   * Whether the previous line is blank.
   */
  previousBlankLine?: boolean | null | undefined

  /**
   * Whether a comment summary is not allowed.
   */
  skipSummary?: boolean | undefined

  /**
   * Create a source document parser.
   *
   * @see {@linkcode Create}
   */
  source: Create

  /**
   * Create a markdown string parser.
   *
   * @see {@linkcode Create}
   */
  string: Create

  /**
   * Create a markdown text parser.
   *
   * @see {@linkcode Create}
   */
  text: Create

  /**
   * Create a type expression parser.
   *
   * @see {@linkcode Create}
   */
  type: Create
}

export type { ParseContext as default }

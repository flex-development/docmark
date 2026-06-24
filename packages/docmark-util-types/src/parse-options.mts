/**
 * @file ParseOptions
 * @module docmark-util-types/ParseOptions
 */

import type { Extension } from '@flex-development/docmark-util-types'
import type { List } from '@flex-development/mark/core'

/**
 * Configuration object defining how to parse.
 *
 * This interface can be augmented to register custom fields.
 *
 * @example
 *  declare module '@flex-development/docmark-util-types' {
 *    interface ParseOptions {
 *      from?: Point | null | undefined
 *    }
 *  }
 */
interface ParseOptions {
  /**
   * The list of syntax extensions to apply.
   *
   * @see {@linkcode Extension}
   * @see {@linkcode List}
   */
  extensions?: List<Extension> | null | undefined
}

export type { ParseOptions as default }

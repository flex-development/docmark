/**
 * @file Type Aliases - FileLike
 * @module mark/parse/types/FileLike
 */

import type { Value } from '@flex-development/mark/parse'

/**
 * A file-like structure.
 */
type FileLike = {
  /**
   * The contents of the file.
   *
   * @see {@linkcode Value}
   */
  value: Value
}

export type { FileLike as default }

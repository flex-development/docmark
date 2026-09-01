/**
 * @file FileLike
 * @module docmark-util-types/FileLike
 */

import type { Value } from '@flex-development/docmark-util-types'

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

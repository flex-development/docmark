/**
 * @file ConstructRecord
 * @module docmark-util-types/ConstructRecord
 */

import type { Construct } from '@flex-development/docmark-util-types'
import type { Numeric } from '@flex-development/mark/core'

/**
 * Several constructs, mapped from their initial codes.
 */
interface ConstructRecord {
  /**
   * Try tokenizing constructs that start with the specified character code.
   *
   * @see {@linkcode Construct}
   * @see {@linkcode Numeric}
   */
  [code: Numeric | number]: Construct | Construct[] | undefined

  /**
   * Try tokenizing constructs that start with any character code.
   *
   * @see {@linkcode ConstructPack}
   */
  null?: Construct | Construct[] | undefined
}

export type { ConstructRecord as default }

// this line will be replaced during the build phase.
// re-exporting is annoying, but unfortunately required.
// `rollup-plugin-dts` does not know how to bundle types only used in index
// signatures, resulting in missing imported types and postbuild errors.
export type { Numeric } from '@flex-development/mark/core'

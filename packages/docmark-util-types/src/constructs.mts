/**
 * @file Constructs
 * @module docmark-util-types/Constructs
 */

import type {
  ConstructPack,
  ConstructRecord
} from '@flex-development/docmark-util-types'

/**
 * A single construct, a list of constructs, or a record of constructs.
 *
 * @see {@linkcode ConstructPack}
 * @see {@linkcode ConstructRecord}
 */
type Constructs = ConstructPack | ConstructRecord

export type { Constructs as default }

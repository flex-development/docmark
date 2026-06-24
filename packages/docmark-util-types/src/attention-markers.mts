/**
 * @file AttentionMarkers
 * @module docmark-util-types/AttentionMarkers
 */

import type { Code } from '@flex-development/docmark-util-types'

/**
 * Attention marker settings.
 */
interface AttentionMarkers {
  /**
   * The list of character codes representing attention markers.
   *
   * @see {@linkcode Code}
   */
  null?: Code[] | undefined
}

export type { AttentionMarkers as default }

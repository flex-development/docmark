/**
 * @file AttentionMarkers
 * @module docmark-util-types/AttentionMarkers
 */

import type { Marker } from '@flex-development/docmark-util-types'

/**
 * Attention marker settings.
 */
interface AttentionMarkers {
  /**
   * The list of character codes representing attention markers.
   *
   * @see {@linkcode Marker}
   */
  null?: Marker[] | undefined
}

export type { AttentionMarkers as default }

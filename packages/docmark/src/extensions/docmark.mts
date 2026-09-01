/**
 * @file Extensions - docmark
 * @module docmark/extensions/docmark
 */

import { summary, typeExpressionValue } from '@flex-development/docmark-grammar'
import type { NormalizedExtension } from '@flex-development/docmark-util-types'

/**
 * The `docmark` syntax extension.
 *
 * @see {@linkcode NormalizedExtension}
 *
 * @internal
 *
 * @const {NormalizedExtension} docmark
 */
const docmark: NormalizedExtension = {
  comment: { null: summary },
  source: {},
  type: { null: typeExpressionValue }
}

export default docmark

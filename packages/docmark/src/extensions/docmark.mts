/**
 * @file Extensions - docmark
 * @module docmark/extensions/docmark
 */

import { summary, typeExpressionValue } from '@flex-development/docmark-grammar'
import { constants } from '@flex-development/docmark-util-symbol'
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
  [constants.contentTypeComments]: {},
  [constants.contentTypeComment]: { null: summary },
  [constants.contentTypeType]: { null: typeExpressionValue },
  [constants.extensionFieldDisable]: { null: [] },
  [constants.extensionFieldSettings]: {}
}

export default docmark

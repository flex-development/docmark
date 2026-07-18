/**
 * @file Extensions - docmark
 * @module docmark/extensions/docmark
 */

import { codes } from '@flex-development/docmark-util-symbol'
import type { NormalizedExtension } from '@flex-development/docmark-util-types'
import blockTag from '../constructs/block-tag.mts'
import inlineTag from '../constructs/inline-tag.mts'
import summary from '../constructs/summary.mts'

/**
 * The `docmark` syntax extension.
 *
 * @see {@linkcode NormalizedExtension}
 *
 * @const {NormalizedExtension} docmark
 */
const docmark: NormalizedExtension = {
  comment: {
    [codes.atSign]: blockTag,
    null: [summary]
  },
  source: {},
  text: {
    [codes.leftCurlyBrace]: inlineTag
  }
}

export default docmark

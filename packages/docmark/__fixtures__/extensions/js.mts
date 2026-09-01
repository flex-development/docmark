/**
 * @file Extensions - js
 * @module fixtures/extensions/js
 */

import blockTag from '#fixtures/constructs/block-tag'
import docblock from '#fixtures/constructs/docblock.comment'
import hashbang from '#fixtures/constructs/hashbang.comment'
import inlineTag from '#fixtures/constructs/inline-tag'
import lineComment from '#fixtures/constructs/line.comment'
import { codes } from '@flex-development/docmark-util-symbol'
import type { NormalizedExtension } from '@flex-development/docmark-util-types'

/**
 * The JavaScript syntax extension.
 *
 * @see {@linkcode NormalizedExtension}
 *
 * @const {NormalizedExtension} js
 */
const js: NormalizedExtension = {
  comment: {
    [codes.atSign]: blockTag
  },
  source: {
    [codes.numberSign]: hashbang,
    [codes.slash]: [docblock, lineComment]
  },
  text: {
    [codes.leftCurlyBrace]: inlineTag
  }
}

export default js

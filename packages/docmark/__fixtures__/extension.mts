/**
 * @file Fixtures - extension
 * @module fixtures/extension
 */

import blockTag from '#fixtures/constructs/block-tag'
import hashbang from '#fixtures/constructs/hashbang.comment'
import htmlComment from '#fixtures/constructs/html.comment'
import inlineTag from '#fixtures/constructs/inline-tag'
import jsBlockComment from '#fixtures/constructs/js-block.comment'
import jsLineComment from '#fixtures/constructs/line.comment'
import { codes } from '@flex-development/docmark-util-symbol'
import type { NormalizedExtension } from '@flex-development/docmark-util-types'

/**
 * A syntax extension.
 *
 * @see {@linkcode NormalizedExtension}
 *
 * @const {NormalizedExtension} extension
 */
const extension: NormalizedExtension = {
  comment: {
    [codes.atSign]: blockTag
  },
  source: {
    [codes.numberSign]: hashbang,
    [codes.slash]: [jsBlockComment, jsLineComment],
    [codes.lessThan]: htmlComment
  },
  text: {
    [codes.leftCurlyBrace]: inlineTag
  }
}

export default extension

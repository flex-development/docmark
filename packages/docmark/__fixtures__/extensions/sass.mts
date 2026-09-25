/**
 * @file Fixtures - sass
 * @module docmark/fixtures/extensions/sass
 */

import blockTag from '#fixtures/constructs/block-tag'
import inlineTag from '#fixtures/constructs/inline-tag'
import blockComment from '#fixtures/constructs/sass/block.comment'
import lineComment from '#fixtures/constructs/sass/line.comment'
import { codes, constants } from '@flex-development/docmark-util-symbol'
import type { NormalizedExtension } from '@flex-development/docmark-util-types'

/**
 * The sass comments syntax extension.
 *
 * @see {@linkcode NormalizedExtension}
 *
 * @const {NormalizedExtension} sass
 */
const sass: NormalizedExtension = {
  [constants.contentTypeComment]: {
    [codes.atSign]: blockTag
  },
  [constants.contentTypeSource]: {
    [codes.slash]: [blockComment, lineComment]
  },
  [constants.contentTypeText]: {
    [codes.leftCurlyBrace]: inlineTag
  }
}

export default sass

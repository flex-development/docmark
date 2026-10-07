/**
 * @file extension
 * @module examples/docmark-extension-tags/extension
 */

import { codes, constants } from '@flex-development/docmark-util-symbol'
import type { NormalizedExtension } from '@flex-development/docmark-util-types'
import inlineTag from './constructs/inline-tag.mts'
import tag from './constructs/tag.mts'

/**
 * The tag syntax extension.
 *
 * @see {@linkcode NormalizedExtension}
 *
 * @const {NormalizedExtension} extension
 */
const extension: NormalizedExtension = {
  [constants.contentTypeComment]: {
    [codes.atSign]: tag
  },
  [constants.contentTypeText]: {
    [codes.leftCurlyBrace]: inlineTag
  }
}

export default extension

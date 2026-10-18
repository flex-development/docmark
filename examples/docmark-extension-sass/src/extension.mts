/**
 * @file extension
 * @module examples/docmark-extension-sass/extension
 */

import tags from '@flex-development/docmark-extension-tags'
import {
  combineExtensions
} from '@flex-development/docmark-util-combine-extensions'
import { codes, constants } from '@flex-development/docmark-util-symbol'
import type { NormalizedExtension } from '@flex-development/docmark-util-types'
import blockComment from './constructs/block.comment.mts'
import lineComment from './constructs/line.comment.mts'

/**
 * The sass comments syntax extension.
 *
 * @see {@linkcode NormalizedExtension}
 *
 * @const {NormalizedExtension} sass
 */
const sass: NormalizedExtension = combineExtensions(tags, {
  [constants.contentTypeComments]: {
    [codes.slash]: [blockComment, lineComment]
  }
})

export default sass

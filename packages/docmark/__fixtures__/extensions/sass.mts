/**
 * @file Fixtures - sass
 * @module docmark/fixtures/extensions/sass
 */

import blockComment from '#fixtures/constructs/sass/block.comment'
import lineComment from '#fixtures/constructs/sass/line.comment'
import tags from '@flex-development/docmark-extension-tags'
import {
  combineExtensions
} from '@flex-development/docmark-util-combine-extensions'
import { codes, constants } from '@flex-development/docmark-util-symbol'
import type { NormalizedExtension } from '@flex-development/docmark-util-types'

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

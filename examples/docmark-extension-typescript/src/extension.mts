/**
 * @file extension
 * @module examples/docmark-extension-typescript/extension
 */

import tags from '@flex-development/docmark-extension-tags'
import {
  combineExtensions
} from '@flex-development/docmark-util-combine-extensions'
import { codes, constants } from '@flex-development/docmark-util-symbol'
import type { NormalizedExtension } from '@flex-development/docmark-util-types'
import blockComment from './constructs/block.comment.mts'
import hashbang from './constructs/hashbang.comment.mts'
import lineComment from './constructs/line.comment.mts'
import tripleSlashComment from './constructs/triple-slash.comment.mts'

/**
 * The TypeScript comments syntax extension.
 *
 * @see {@linkcode NormalizedExtension}
 *
 * @const {NormalizedExtension} typescript
 */
const typescript: NormalizedExtension = combineExtensions(tags, {
  [constants.contentTypeComments]: {
    [codes.numberSign]: hashbang,
    [codes.slash]: [blockComment, tripleSlashComment, lineComment]
  }
})

export default typescript

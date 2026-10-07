/**
 * @file Fixtures - typescript
 * @module docmark/fixtures/extensions/typescript
 */

import blockComment from '#fixtures/constructs/ts/block.comment'
import hashbang from '#fixtures/constructs/ts/hashbang.comment'
import lineComment from '#fixtures/constructs/ts/line.comment'
import tripleSlashComment from '#fixtures/constructs/ts/triple-slash.comment'
import tags from '@flex-development/docmark-extension-tags'
import {
  combineExtensions
} from '@flex-development/docmark-util-combine-extensions'
import { codes, constants } from '@flex-development/docmark-util-symbol'
import type { NormalizedExtension } from '@flex-development/docmark-util-types'

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

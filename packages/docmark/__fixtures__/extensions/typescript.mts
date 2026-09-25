/**
 * @file Fixtures - typescript
 * @module docmark/fixtures/extensions/typescript
 */

import blockTag from '#fixtures/constructs/block-tag'
import inlineTag from '#fixtures/constructs/inline-tag'
import blockComment from '#fixtures/constructs/ts/block.comment'
import hashbang from '#fixtures/constructs/ts/hashbang.comment'
import lineComment from '#fixtures/constructs/ts/line.comment'
import tripleSlashComment from '#fixtures/constructs/ts/triple-slash.comment'
import { codes, constants } from '@flex-development/docmark-util-symbol'
import type { NormalizedExtension } from '@flex-development/docmark-util-types'

/**
 * The TypeScript comments syntax extension.
 *
 * @see {@linkcode NormalizedExtension}
 *
 * @const {NormalizedExtension} typescript
 */
const typescript: NormalizedExtension = {
  [constants.contentTypeComment]: {
    [codes.atSign]: blockTag
  },
  [constants.contentTypeSource]: {
    [codes.numberSign]: hashbang,
    [codes.slash]: [blockComment, tripleSlashComment, lineComment]
  },
  [constants.contentTypeText]: {
    [codes.leftCurlyBrace]: inlineTag
  }
}

export default typescript

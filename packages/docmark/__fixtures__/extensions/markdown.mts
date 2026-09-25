/**
 * @file Fixtures - markdown
 * @module docmark/fixtures/extensions/markdown
 */

import markdownComment from '#fixtures/constructs/markdown/comment'
import { codes, constants } from '@flex-development/docmark-util-symbol'
import type { NormalizedExtension } from '@flex-development/docmark-util-types'

/**
 * The markdown comments syntax extension.
 *
 * @see {@linkcode NormalizedExtension}
 *
 * @const {NormalizedExtension} markdown
 */
const markdown: NormalizedExtension = {
  [constants.contentTypeSource]: {
    [codes.lessThan]: [markdownComment]
  }
}

export default markdown

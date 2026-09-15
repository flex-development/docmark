/**
 * @file Constructs - blockComment
 * @module docmark/fixtures/blockComment
 */

import factory from '@flex-development/docmark-factory-block'
import { codes, kind, tt } from '@flex-development/docmark-util-symbol'
import type {
  ContinuableConstruct,
  NamedConstruct
} from '@flex-development/docmark-util-types'

/**
 * The block comment construct.
 *
 * @const {ContinuableConstruct & NamedConstruct} blockComment
 */
const blockComment: ContinuableConstruct & NamedConstruct = factory({
  construct: { name: `${tt.comment}:${kind.block}` },
  fields: { info: true },
  markers: {
    closer: [
      { code: codes.asterisk, type: null },
      { code: codes.slash, type: null }
    ],
    line: codes.asterisk,
    opener: [
      { code: codes.slash, type: null },
      { code: codes.asterisk, type: null },
      { code: codes.asterisk, type: null }
    ]
  }
})

export default blockComment

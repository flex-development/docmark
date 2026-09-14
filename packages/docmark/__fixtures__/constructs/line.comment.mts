/**
 * @file Fixtures - lineComment
 * @module docmark/fixtures/constructs/lineComment
 */

import factory from '@flex-development/docmark-factory-line'
import { codes, kind, tt } from '@flex-development/docmark-util-symbol'
import type {
  ContinuableConstruct,
  NamedConstruct
} from '@flex-development/docmark-util-types'

/**
 * The line comment construct.
 *
 * This construct is expected to run at the `source` content level.
 *
 * @const {ContinuableConstruct & NamedConstruct} lineComment
 */
const lineComment: ContinuableConstruct & NamedConstruct = factory({
  construct: { name: `${tt.comment}:${kind.line}` },
  markers: [codes.slash, codes.slash]
})

export default lineComment

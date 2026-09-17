/**
 * @file Constructs - htmlComment
 * @module docmark/fixtures/htmlComment
 */

import factory from '@flex-development/docmark-factory-block'
import { codes, tt } from '@flex-development/docmark-util-symbol'
import type {
  ContinuableConstruct,
  NamedConstruct
} from '@flex-development/docmark-util-types'

/**
 * The HTML comment construct.
 *
 * @const {ContinuableConstruct & NamedConstruct} htmlComment
 */
const htmlComment: ContinuableConstruct & NamedConstruct = factory({
  construct: { name: `${tt.comment}:html` },
  markers: {
    closer: [codes.dash, codes.dash, codes.greaterThan],
    opener: [codes.lessThan, codes.exclamationMark, codes.dash, codes.dash]
  }
})

export default htmlComment

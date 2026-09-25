/**
 * @file Constructs - markdownComment
 * @module docmark/fixtures/markdown/comment
 */

import factory from '@flex-development/docmark-factory-block'
import { codes } from '@flex-development/docmark-util-symbol'
import type {
  ContinuableConstruct
} from '@flex-development/docmark-util-types'

/**
 * The markdown comment construct.
 *
 * This construct is expected to run at the `source` content level.
 *
 * @const {ContinuableConstruct} markdownComment
 */
const markdownComment: ContinuableConstruct = factory({
  markers: {
    closer: [codes.dash, codes.dash, codes.greaterThan],
    opener: [codes.lessThan, codes.exclamationMark, codes.dash, codes.dash]
  }
})

export default markdownComment

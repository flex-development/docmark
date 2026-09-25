/**
 * @file Fixtures - lineComment
 * @module docmark/fixtures/constructs/ts/line
 */

import factory from '@flex-development/docmark-factory-line'
import { codes } from '@flex-development/docmark-util-symbol'
import type {
  ContinuableConstruct
} from '@flex-development/docmark-util-types'

/**
 * The TypeScript line comment construct.
 *
 * This construct is expected to run at the `source` content level.
 *
 * @const {ContinuableConstruct} lineComment
 */
const lineComment: ContinuableConstruct = factory({
  markers: [codes.slash, codes.slash]
})

export default lineComment

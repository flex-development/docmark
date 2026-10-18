/**
 * @file Constructs - lineComment
 * @module examples/docmark-extension-typescript/constructs/lineComment
 */

import factory from '@flex-development/docmark-factory-line'
import { codes } from '@flex-development/docmark-util-symbol'
import type {
  ContinuableConstruct
} from '@flex-development/docmark-util-types'

/**
 * The TypeScript line comment construct.
 *
 * This construct is expected to run at the `comments` content level.
 *
 * @const {ContinuableConstruct} lineComment
 */
const lineComment: ContinuableConstruct = factory({
  markers: [codes.slash, codes.slash]
})

export default lineComment

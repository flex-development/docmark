/**
 * @file Constructs - lineComment
 * @module examples/jaymark/constructs/lineComment
 */

import { factoryLineComment } from '@flex-development/docmark-factory-line'
import { codes } from '@flex-development/docmark-util-symbol'
import type {
  ContinuableConstruct,
  TokenizeContext
} from '@flex-development/docmark-util-types'
import { ok as assert } from 'devlop'

/**
 * The line comment construct.
 *
 * This construct is expected to run at the `comments` content level.
 *
 * @see {@linkcode ContinuableConstruct}
 *
 * @const {ContinuableConstruct} lineComment
 */
const lineComment: ContinuableConstruct = factoryLineComment({
  markers: [
    { code: codes.slash, fields: { _open: true } },
    { code: codes.slash, fields: { _close: true } }
  ],

  /**
   * Check whether a line comment is allowed at the current position.
   *
   * @this {TokenizeContext}
   *
   * @return {boolean}
   *  Whether a line comment is not allowed
   */
  skipComment(this: TokenizeContext): boolean {
    assert(this.parser.constructs.settings, 'expected parser settings')

    // comments not allowed.
    if (!this.parser.constructs.settings.json?.comments) return true

    // comment not allowed at the current position.
    return !!this.parser.skipComment
  }
})

export default lineComment

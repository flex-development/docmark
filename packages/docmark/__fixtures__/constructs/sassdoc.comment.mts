/**
 * @file Fixtures - sassdocComment
 * @module docmark/fixtures/constructs/sassdocComment
 */

import factory, { type Markers } from '@flex-development/docmark-factory-line'
import { codes } from '@flex-development/docmark-util-symbol'
import type {
  ContinuableConstruct,
  TokenFields,
  TokenizeContext
} from '@flex-development/docmark-util-types'

/**
 * The sass documentation comment construct.
 *
 * This construct is expected to run at the `source` content level.
 *
 * @const {ContinuableConstruct} sassdocComment
 */
const sassdocComment: ContinuableConstruct = factory({
  /**
   * Create a token fields object.
   *
   * @this {TokenizeContext}
   *
   * @return {TokenFields}
   *  The token fields object
   */
  fields(this: TokenizeContext): TokenFields {
    return { info: true }
  },

  /**
   * Finalize the line comment construct.
   *
   * @this {void}
   *
   * @param {ContinuableConstruct} construct
   *  The construct to finalize
   * @return {undefined}
   */
  finalizeConstruct(this: void, construct: ContinuableConstruct): undefined {
    return void construct
  },

  /**
   * Create a markers configuration.
   *
   * @this {TokenizeContext}
   *
   * @return {Markers}
   *  The markers configuration
   */
  markers(this: TokenizeContext): Markers {
    return [codes.slash, codes.slash, codes.slash]
  }
})

export default sassdocComment

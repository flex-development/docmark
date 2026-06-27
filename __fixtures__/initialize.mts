/**
 * @file Fixtures - initialize
 * @module fixtures/initialize
 */

import { ct } from '@flex-development/docmark-util-symbol'
import { initialize as initialConstruct } from '@flex-development/mark-parser'
import type { InitialConstructs } from '@flex-development/mark/parse'

/**
 * Record, where each key is a content type,
 * and each value is a mock initial construct.
 *
 * @const {InitialConstructs} initialize
 */
const initialize: InitialConstructs = {
  [ct.source]: initialConstruct(ct.source),
  [ct.comment]: initialConstruct(ct.comment),
  [ct.document]: initialConstruct(ct.document),
  [ct.flow]: initialConstruct(ct.flow),
  [ct.content]: initialConstruct(ct.content),
  [ct.string]: initialConstruct(ct.string),
  [ct.text]: initialConstruct(ct.text)
}

export default initialize

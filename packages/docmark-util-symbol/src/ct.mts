/**
 * @file ct
 * @module docmark-util-symbol/ct
 */

import constants from './constants.mts'

/**
 * Registry of all content types used by docmark.
 *
 * @enum {string}
 */
const ct = {
  comment: constants.contentTypeComment,
  content: constants.contentTypeContent,
  document: constants.contentTypeDocument,
  flow: constants.contentTypeFlow,
  source: constants.contentTypeSource,
  string: constants.contentTypeString,
  text: constants.contentTypeText,
  type: constants.contentTypeType
} as const

export default ct

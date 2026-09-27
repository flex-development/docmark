/**
 * @file ContentTypeMap
 * @module docmark-util-types/ContentTypeMap
 */

/**
 * Registry of content types.\
 * Content types are used on tokens to define their subcontent type.
 *
 * @todo document content levels
 *
 * @example
 *  declare module '@flex-development/docmark-util-types' {
 *    interface ContentTypeMap {
 *      source: 'source'
 *    }
 *  }
 */
interface ContentTypeMap {
  comment: 'comment'
  comments: 'comments'
  content: 'content'
  document: 'document'
  flow: 'flow'
  string: 'string'
  text: 'text'
  type: 'type'
}

export type { ContentTypeMap as default }

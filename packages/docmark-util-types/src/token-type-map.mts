/**
 * @file TokenTypeMap
 * @module docmark-util-types/TokenTypeMap
 */

import type * as micromark from 'micromark-util-types'

/**
 * Registry of token types.
 *
 * The token type `null` is forbidden.
 * The ecosystem uses the `null` key to support additional functionality.
 *
 * Libraries and other tools can augment this interface
 * to register custom token types.
 *
 * @example
 *  declare module '@flex-development/docmark-util-types' {
 *    interface TokenTypeMap {
 *      custom: 'custom'
 *    }
 *  }
 *
 * @see {@linkcode micromark.TokenTypeMap}
 *
 * @extends {micromark.TokenTypeMap}
 */
interface TokenTypeMap extends micromark.TokenTypeMap {
  blockTag: 'blockTag'
  chunkComment: 'chunkComment'
  chunkMarkdown: 'chunkMarkdown'
  comment: 'comment'
  commentCloser: 'commentCloser'
  commentLineMarker: 'commentLineMarker'
  commentLinePadding: 'commentLinePadding'
  commentLinePrefix: 'commentLinePrefix'
  commentOpener: 'commentOpener'
  eoc: 'eoc'
  inlineTag: 'inlineTag'
  inlineTagText: 'inlineTagText'
  null: never
  summary: 'summary'
  tagName: 'tagName'
  tagNameIdentifier: 'tagNameIdentifier'
  tagNameMarker: 'tagNameMarker'
}

export type { TokenTypeMap as default }

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
  chunkType: 'chunkType'
  comment: 'comment'
  commentCloser: 'commentCloser'
  commentLineMarker: 'commentLineMarker'
  commentLinePrefix: 'commentLinePrefix'
  commentOpener: 'commentOpener'
  commentPadding: 'commentPadding'
  eoc: 'eoc'
  identifier: 'identifier'
  inlineTag: 'inlineTag'
  inlineTagMarker: 'inlineTagMarker'
  inlineTagText: 'inlineTagText'
  namepath: 'namepath'
  namepathConnector: 'namepathConnector'
  namepathIdentifier: 'namepathIdentifier'
  namepathMarker: 'namepathMarker'

  /**
   * Forbidden token type.
   *
   * The ecosystem uses the `null` key to support additional functionality.
   */
  null: never

  summary: 'summary'
  summaryMarker: 'summaryMarker'
  tagName: 'tagName'
  tagNameIdentifier: 'tagNameIdentifier'
  tagNameMarker: 'tagNameMarker'
  typeExpression: 'typeExpression'
  typeExpressionValue: 'typeExpressionValue'
  typeMetadata: 'typeMetadata'
  typeMetadataMarker: 'typeMetadataMarker'
}

export type { TokenTypeMap as default }

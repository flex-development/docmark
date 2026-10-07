/**
 * @file TokenTypeMap
 * @module docmark-util-types/TokenTypeMap
 */

import type * as micromark from 'micromark-util-types'

/**
 * Registry of token types.
 *
 * Libraries and other tools can augment this interface to register
 * custom token types.
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
  chunkComment: 'chunkComment'
  chunkExpression: 'chunkExpression'
  chunkLanguage: 'chunkLanguage'
  chunkMarkdown: 'chunkMarkdown'
  chunkType: 'chunkType'
  comment: 'comment'
  commentCloser: 'commentCloser'
  commentLinePrefix: 'commentLinePrefix'
  commentMarker: 'commentMarker'
  commentOpener: 'commentOpener'
  commentPadding: 'commentPadding'
  eoc: 'eoc'
  identifier: 'identifier'
  inlineTag: 'inlineTag'
  inlineTagMarker: 'inlineTagMarker'
  inlineTagText: 'inlineTagText'
  interpreterArgument: 'interpreterArgument'
  interpreterPath: 'interpreterPath'
  namepath: 'namepath'
  namepathConnector: 'namepathConnector'
  namepathIdentifier: 'namepathIdentifier'
  namepathMarker: 'namepathMarker'
  summary: 'summary'
  summaryMarker: 'summaryMarker'
  tag: 'tag'
  tagName: 'tagName'
  tagNameIdentifier: 'tagNameIdentifier'
  tagNameMarker: 'tagNameMarker'
  typeExpression: 'typeExpression'
  typeExpressionValue: 'typeExpressionValue'
  typeMetadata: 'typeMetadata'
  typeMetadataMarker: 'typeMetadataMarker'
}

export type { TokenTypeMap as default }

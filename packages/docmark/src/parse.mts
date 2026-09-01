/**
 * @file parse
 * @module docmark/parse
 */

import {
  combineExtensions
} from '@flex-development/docmark-util-combine-extensions'
import { codes, constants } from '@flex-development/docmark-util-symbol'
import type {
  ContentType,
  InitialConstructs,
  NormalizedExtension,
  ParseContext,
  ParseOptions,
  TokenizeContext
} from '@flex-development/docmark-util-types'
import { createTokenizer, type Options } from '@flex-development/mark-parser'
import { eol } from '@flex-development/mark-util-character'
import docmark from './extensions/docmark.mts'
import markdown from './extensions/markdown.mts'
import comment from './initialize/comment.mts'
import content from './initialize/content.mts'
import document from './initialize/document.mts'
import flow from './initialize/flow.mts'
import source from './initialize/source.mts'
import { string, text } from './initialize/text.mts'
import typeExpression from './initialize/type.mts'

export default parse

/**
 * Create a parser.
 *
 * Tokenizers deal with one content type.
 * The parser is the object dealing with it all.
 *
 * @see {@linkcode ParseContext}
 * @see {@linkcode ParseOptions}
 *
 * @this {void}
 *
 * @param {ParseOptions | null | undefined} [options]
 *  Options for parsing
 * @return {ParseContext}
 *  The parse context
 */
function parse(
  this: void,
  options?: ParseOptions | null | undefined
): ParseContext {
  /**
   * The tokenization context.
   *
   * @const {TokenizeContext} context
   */
  const context: TokenizeContext = createTokenizer({
    debug: 'docmark',
    eol,
    extensions: extensions as Options['extensions'],
    finalizeContext,
    initialize: initialize as Options['initialize']
  })

  return context.parser

  /**
   * Create a syntax extension.
   *
   * @this {void}
   *
   * @return {NormalizedExtension}
   *  The normalized syntax extension
   */
  function extensions(this: void): NormalizedExtension {
    return combineExtensions(docmark, markdown, options?.extensions)
  }

  /**
   * Finalize the tokenization context.
   *
   * @this {void}
   *
   * @param {TokenizeContext} self
   *  The base tokenization context
   * @return {undefined}
   */
  function finalizeContext(this: void, self: TokenizeContext): undefined {
    if (typeof self.parser.defined === 'undefined') self.parser.defined = []
    if (typeof self.parser.lazy === 'undefined') self.parser.lazy = {}

    switch (self.contentType) {
      case constants.contentTypeDocument:
      case constants.contentTypeFlow:
      case constants.contentTypeContent:
      case constants.contentTypeText:
      case constants.contentTypeString:
        self.code = codes.eos
        self.previous = codes.eos
        self.noEmptyTokens = true
        self.noPrevious = true
        break
      case constants.contentTypeSource:
      case constants.contentTypeComment:
      case constants.contentTypeType:
        self.code = codes.bos
        self.previous = codes.bos
        break
      default:
        break
    }

    if (self.contentType as ContentType | undefined) {
      options?.finalizeContext?.(self)
    }

    return void self
  }

  /**
   * Create a record of initial constructs.
   *
   * @this {void}
   *
   * @return {InitialConstructs}
   *  The record of initial constructs
   */
  function initialize(this: void): InitialConstructs {
    return {
      [constants.contentTypeSource]: source,
      [constants.contentTypeComment]: comment,
      [constants.contentTypeType]: typeExpression,
      [constants.contentTypeDocument]: document,
      [constants.contentTypeFlow]: flow,
      [constants.contentTypeContent]: content,
      [constants.contentTypeText]: text,
      [constants.contentTypeString]: string,
      ...options?.initializers
    }
  }
}

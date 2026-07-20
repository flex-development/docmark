/**
 * @file parse
 * @module docmark/parse
 */

import { codes, ct } from '@flex-development/docmark-util-symbol'
import type {
  NormalizedExtension,
  ParseContext,
  ParseOptions,
  TokenizeContext
} from '@flex-development/docmark-util-types'
import {
  createTokenizer,
  initialize as initial
} from '@flex-development/mark-parser'
import { combineExtensions } from '@flex-development/mark-parser/utils'
import { eol } from '@flex-development/mark-util-character'
import type { InitialConstructs } from '@flex-development/mark/parse'
import docmark from './extensions/docmark.mts'
import markdown from './extensions/markdown.mts'
import comment from './initialize/comment.mts'
import content from './initialize/content.mts'
import document from './initialize/document.mts'
import flow from './initialize/flow.mts'
import source from './initialize/source.mts'
import { string, text } from './initialize/text.mts'

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
    extensions,
    finalizeContext,
    initialize
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
    return combineExtensions(
      docmark,
      { insideSpan: { null: [{ resolveAll: string.resolveAll }] } },
      // @ts-expect-error looks like a mark extension (2345).
      markdown,
      options?.extensions
    )
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
      case ct.document:
      case ct.flow:
      case ct.content:
      case ct.text:
      case ct.string:
        self.noEmptyTokens = true
        self.noPrevious = true
        break
      default:
        self.previous = codes.bos
    }

    return void void self
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
      [ct.source]: source,
      [ct.comment]: comment,
      [ct.document]: document,
      [ct.flow]: flow,
      [ct.content]: content,
      [ct.string]: string,
      [ct.text]: text,
      [ct.type]: initial(ct.type)
    }
  }
}

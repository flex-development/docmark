/**
 * @file parse
 * @module docmark/parse
 */

import { ct } from '@flex-development/docmark-util-symbol'
import type {
  NormalizedExtension,
  ParseContext,
  ParseOptions,
  TokenizeContext
} from '@flex-development/docmark-util-types'
import {
  createTokenizer,
  initialize as initial,
  type Options
} from '@flex-development/mark-parser'
import { combineExtensions } from '@flex-development/mark-parser/utils'
import { eol } from '@flex-development/mark-util-character'
import type {
  InitialConstruct,
  InitialConstructs
} from '@flex-development/mark/parse'
import content from './constructs/initialize/content.mts'
import document from './constructs/initialize/document.mts'
import flow from './constructs/initialize/flow.mts'
import { string, text } from './constructs/initialize/text.mts'
import docmark from './extensions/docmark.mts'
import markdown from './extensions/markdown.mts'

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
   * @param {InitialConstruct | Partial<InitialConstructs>} initialize
   *  The initial construct, or the record of initial constructs
   * @param {Partial<Options>} options
   *  The options used to create the tokenizer
   * @return {undefined}
   */
  function finalizeContext(
    this: void,
    self: TokenizeContext,
    initialize: InitialConstruct | Partial<InitialConstructs>,
    options: Partial<Options>
  ): undefined {
    if (typeof self.parser.defined === 'undefined') self.parser.defined = []
    if (typeof self.parser.lazy === 'undefined') self.parser.lazy = {}

    if (self.contentType !== ct.document && self.contentType !== ct.source) {
      options.noPrevious = true
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
      [ct.source]: initial(ct.source),
      [ct.comment]: initial(ct.comment),
      [ct.document]: document,
      [ct.flow]: flow,
      [ct.content]: content,
      [ct.string]: string,
      [ct.text]: text
    }
  }
}

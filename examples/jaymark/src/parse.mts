/**
 * @file parse
 * @module jaymark/parse
 */

import * as docmark from '@flex-development/docmark'
import { codes, constants } from '@flex-development/docmark-util-symbol'
import type {
  ParseContext,
  TokenizeContext
} from '@flex-development/docmark-util-types'
import type { Options } from '@flex-development/jaymark'
import extension from './extension.mts'
import language from './initialize/language.mts'

export default parse

/**
 * Create a parser.
 *
 * Tokenizers deal with one content type.\
 * The parser is the object dealing with it all.
 *
 * @see {@linkcode ParseContext}
 * @see {@linkcode Options}
 *
 * @this {void}
 *
 * @param {Options} [options]
 *  The parse options
 * @return {ParseContext}
 *  The parse context
 */
function parse(this: void, options?: Options): ParseContext {
  return docmark.parse({
    extensions: [extension, { settings: { json: options } }],
    finalizeContext,
    initializers: { language }
  })

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
    switch (self.contentType) {
      case constants.contentTypeLanguage:
        self.code = codes.bos
        self.previous = codes.bos
        self.debug.namespace = `jaymark:${self.contentType}`
        break
      default:
        break
    }

    return void self
  }
}

/**
 * @file docmark
 * @module docmark/docmark
 */

import type { Options } from '@flex-development/docmark'
import type {
  Chunk,
  Encoding,
  Event,
  FileLike,
  ParseContext,
  Value
} from '@flex-development/docmark-util-types'
import parse from './parse.mts'
import postprocess from './postprocess.mts'
import preprocess from './preprocess.mts'

export default docmark

/**
 * Create an event stream.
 *
 * @see {@linkcode Encoding}
 * @see {@linkcode Event}
 * @see {@linkcode FileLike}
 * @see {@linkcode Options}
 * @see {@linkcode Value}
 *
 * @this {void}
 *
 * @param {FileLike | Value | null | undefined} value
 *  The source file or content to parse
 * @param {Encoding | null | undefined} [encoding]
 *  The character encoding to use when `value` or its contents
 *  is an {@linkcode Uint8Array}
 * @param {Options | null | undefined} [options]
 *  The configuration options
 * @return {Event[]}
 *  The list of events
 */
function docmark(
  this: void,
  value: FileLike | Value | null | undefined,
  encoding?: Encoding | null | undefined,
  options?: Options | null | undefined
): Event[]

/**
 * Create an event stream.
 *
 * @see {@linkcode Event}
 * @see {@linkcode FileLike}
 * @see {@linkcode Options}
 * @see {@linkcode Value}
 *
 * @this {void}
 *
 * @param {FileLike | Value | null | undefined} value
 *  The source file or content to parse
 * @param {Options | null | undefined} [options]
 *  The configuration options
 * @return {Event[]}
 *  The list of events
 */
function docmark(
  this: void,
  value: FileLike | Value | null | undefined,
  options?: Options | null | undefined
): Event[]

/**
 * Create an event stream.
 *
 * @see {@linkcode Encoding}
 * @see {@linkcode Event}
 * @see {@linkcode FileLike}
 * @see {@linkcode Options}
 * @see {@linkcode Value}
 *
 * @this {void}
 *
 * @param {FileLike | Value | null | undefined} value
 *  The source file or content to parse
 * @param {Encoding | Options | null | undefined} [encoding]
 *  The character encoding to use when `value` or its contents
 *  is an {@linkcode Uint8Array}, or configuration options
 * @param {Options | null | undefined} [options]
 *  The configuration options
 * @return {Event[]}
 *  The list of events
 */
function docmark(
  this: void,
  value: FileLike | Value | null | undefined,
  encoding?: Encoding | Options | null | undefined,
  options?: Options | null | undefined
): Event[] {
  if (typeof encoding !== 'string') {
    options = encoding
    encoding = undefined
  }

  /**
   * The chunks to write.
   *
   * @const {Chunk[]} slice
   */
  const slice: Chunk[] = preprocess(options)(value, encoding, true)

  /**
   * The parse context.
   *
   * @const {ParseContext} parser
   */
  const parser: ParseContext = parse(options)

  // run the specified parser.
  if (options?.contentType && options.contentType in parser) {
    return postprocess(parser[options.contentType]!(options.from).write(slice))
  }

  // run the `comments` parser.
  return postprocess(parser.comments(options?.from).write(slice))
}

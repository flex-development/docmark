/**
 * @file Interfaces - Options
 * @module docmark/interfaces/Options
 */

import type {
  ContentType,
  ParseOptions,
  Point,
  PreprocessOptions
} from '@flex-development/docmark-util-types'

/**
 * Options for creating an event stream.
 *
 * @see {@linkcode ParseOptions}
 * @see {@linkcode PreprocessOptions}
 */
interface Options extends ParseOptions, PreprocessOptions {
  /**
   * The content type of the parser to run.
   *
   * @see {@linkcode ContentType}
   *
   * @default constants.contentTypeComments
   */
  contentType?: ContentType | null | undefined

  /**
   * The point before the first character in the content.
   *
   * Token positions will be relative to this point.
   *
   * @see {@linkcode Point}
   *
   * @default
   *  { column: 1, line: 1, offset: 0 }
   */
  from?: Point | null | undefined
}

export type { Options as default }

/**
 * @file TokenizeContext
 * @module docmark-util-types/TokenizeContext
 */

import type {
  Code,
  Construct,
  ContainerState,
  DefineSkip,
  Event,
  Now,
  ParseContext,
  SliceSerialize,
  SliceStream,
  Write
} from '@flex-development/docmark-util-types'

/**
 * Context object to assist with tokenizing syntax constructs.
 *
 * This interface can be augmented to register custom fields.
 *
 * @example
 *  declare module '@flex-development/docmark-util-types' {
 *    interface TokenizeContext {
 *      field?: string | undefined
 *    }
 *  }
 */
interface TokenizeContext {
  /**
   * Whether trailing whitespace is sensitive and allowed when tokenizing `text`
   * or `string` content.\
   * Normally, trailing spaces and tabs are dropped.
   */
  _contentTypeTextTrailing?: boolean | undefined

  /**
   * Whether the tokenizer is tokenizing the first content of a list item
   * construct.
   *
   * > 👉 **Note**: Shared with `micromark-extension-gfm-task-list-item`.
   */
  _gfmTasklistFirstContentOfListItem?: boolean | undefined

  /**
   * The current character code.
   *
   * @see {@linkcode Code}
   */
  code: Code

  /**
   * Shared state set when parsing containers.
   *
   * Containers are typically parsed in separate phases:
   * their first line (`tokenize`), continued lines (`continuation.tokenize`),
   * and finally `exit`.
   * This record can be used to store information between these hooks.
   *
   * @see {@linkcode ContainerState}
   */
  containerState?: ContainerState | undefined

  /**
   * The current construct.
   *
   * Constructs that are not `partial` are set here.
   *
   * @see {@linkcode Construct}
   */
  currentConstruct?: Construct | undefined

  /**
   * Define a skip.
   *
   * As containers (comment lines, block quotes, lists), "nibble" a prefix from
   * the margins, where a line starts after that prefix can be defined here.
   *
   * When the tokenizer moves after consuming a line ending corresponding to
   * the line number in the given point, the tokenizer shifts past the prefix
   * based on the column in the shifted point.
   *
   * @see {@linkcode DefineSkip}
   */
  defineSkip: DefineSkip

  /**
   * The current list of events.
   *
   * @see {@linkcode Event}
   */
  events: Event[]

  /**
   * Whether we're currently interrupting.
   *
   * For example:
   *
   * ```markdown
   * a
   * # b
   * ```
   *
   * At `2:1`, we’re "interrupting".
   */
  interrupt?: boolean | undefined

  /**
   * Get the current place in the content.
   *
   * @see {@linkcode Now}
   */
  now: Now

  /**
   * The relevant parsing context.
   *
   * Tokenizers deal with one content type.
   * The parser is the object dealing with it all.
   *
   * @see {@linkcode ParseContext}
   */
  parser: ParseContext

  /**
   * The previous character code.
   *
   * @see {@linkcode Code}
   */
  previous: Code

  /**
   * Get the text that spans a token (or location).
   *
   * @see {@linkcode SliceSerialize}
   */
  sliceSerialize: SliceSerialize

  /**
   * Get the chunks that span a token (or location).
   *
   * @see {@linkcode SliceStream}
   */
  sliceStream: SliceStream

  /**
   * Write a slice of chunks.
   *
   * The eof code (`null`) can be used to signal the end of the stream.
   *
   * @see {@linkcode Write}
   */
  write: Write
}

export type { TokenizeContext as default }

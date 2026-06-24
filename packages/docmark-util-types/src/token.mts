/**
 * @file Token
 * @module docmark-util-types/Token
 */

import type {
  Code,
  Position,
  TokenFields,
  TokenType
} from '@flex-development/docmark-util-types'

/**
 * A span of one (`1`) or more chunks.
 *
 * Tokens are the core of what docmark produces: libraries and other tools can
 * turn them into different things.
 *
 * Tokens are essentially names attached to a slice of chunks, such as
 * `lineEndingBlank` for certain line endings, `codeFenced` for fenced code, or
 * `summary` for an entire comment summary.
 *
 * Sometimes, more info is attached to tokens, such as `_open` and `_close`
 * by `attention` (strong, emphasis) to signal whether the sequence can open
 * or close an attention run.
 *
 * Linked tokens are used because outer constructs are parsed first.
 * For example:
 *
 * ```markdown
 * > *a
 * b*.
 * ```
 *
 * 1.  The block quote marker and the space after it is parsed first
 * 2.  The rest of the line is a `chunkFlow` token
 * 3.  The two spaces on the second line are a `linePrefix`
 * 4.  The rest of the line is another `chunkFlow` token
 *
 * The two `chunkFlow` tokens are linked together.
 * The chunks they span are then passed through the `flow` tokenizer.
 *
 * Sometimes tokens need more info!
 * This interface can be augmented to register custom token fields.
 *
 * @example
 *  declare module '@flex-development/docmark-util-types' {
 *    interface Token {
 *      value?: string | null | undefined
 *    }
 *  }
 *
 * @see {@linkcode Code}
 * @see {@linkcode Position}
 * @see {@linkcode TokenFields}
 * @see {@linkcode TokenType}
 *
 * @template {TokenType} [T=TokenType]
 *  The token type
 *
 * @extends {Position}
 * @extends {TokenFields}
 */
interface Token<T extends TokenType = TokenType> extends Position, TokenFields {
  /**
   * The token type.
   */
  type: T
}

export type { Token as default }

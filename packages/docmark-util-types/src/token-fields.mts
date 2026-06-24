/**
 * @file TokenFields
 * @module docmark-util-types/TokenFields
 */

import type {
  ContentType,
  Token,
  TokenizeContext
} from '@flex-development/docmark-util-types'

/**
 * Registry of token fields.
 *
 * This interface can be augmented to register custom token fields.
 *
 * @example
 *  declare module '@flex-development/docmark-util-types' {
 *    interface TokenFields {
 *      value?: string | null | undefined
 *    }
 *  }
 */
interface TokenFields {
  /**
   * Whether a link opening is balanced balanced:
   * it’s not a link opening, but has a balanced closing.
   */
  _balanced?: boolean | undefined

  /**
   * Whether an attention sequence is a closer.
   *
   * Depending on the character before sequences (`**`), the sequence can open,
   * close, both, or none.
   */
  _close?: boolean | undefined

  /**
   * Whether the token is a container token.
   */
  _container?: boolean | undefined

  /**
   * When {@linkcode contentType} is `string` or `text`, whether trailing
   * whitespace is sensitive and allowed.\
   * Normally, trailing spaces and tabs are dropped.
   */
  _contentTypeTextTrailing?: boolean | undefined

  /**
   * Whether a link opening cannot be used because links are incorrect.
   */
  _inactive?: boolean | undefined

  /**
   * When parsing GFM task lists, whether a token is in the first content of a
   * list item construct.
   */
  _isInFirstContentOfListItem?: boolean | undefined

  /**
   * When parsing lists, whether a list is loose or not.
   */
  _loose?: boolean | undefined

  /**
   * Whether an attention sequence is an opener.
   *
   * Depending on the character before sequences (`**`), the sequence can open,
   * close, both, or none.
   */
  _open?: boolean | undefined

  /**
   * The connected tokenizer, used when dealing with linked tokens.
   *
   * @see {@linkcode TokenizeContext}
   */
  _tokenizer?: TokenizeContext | undefined

  /**
   * Declare the token as having content of a certain type.
   *
   * @see {@linkcode ContentType}
   */
  contentType?: ContentType | undefined

  /**
   * The next token in a list of linked tokens.
   *
   * @see {@linkcode Token}
   */
  next?: Token | undefined

  /**
   * The previous token in a list of linked tokens.
   *
   * @see {@linkcode Token}
   */
  previous?: Token | undefined
}

export type { TokenFields as default }

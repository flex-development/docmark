/**
 * @file Event
 * @module docmark-util-types/Event
 */

import type {
  EventType,
  Token,
  TokenizeContext,
  TokenType
} from '@flex-development/docmark-util-types'

/**
 * The start or end of a token amongst other events.
 *
 * Tokens can "contain" other tokens, even though they are stored in a flat
 * list, through `enter`ing before them, and `exit`ing after them.
 *
 * @see {@linkcode EventType}
 * @see {@linkcode TokenType}
 * @see {@linkcode TokenizeContext}
 * @see {@linkcode Token}
 *
 * @template {TokenType} [T=TokenType]
 *  The token type
 */
type Event<T extends TokenType = TokenType> = [
  event: EventType,
  token: Token<T>,
  context: TokenizeContext
]

export type { Event as default }

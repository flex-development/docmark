/**
 * @file Resolver
 * @module docmark-util-types/Resolver
 */

import type {
  Construct,
  Event,
  TokenizeContext,
  Tokenizer
} from '@flex-development/docmark-util-types'

/**
 * Handle events coming from a {@linkcode Tokenizer}.
 *
 * @see {@linkcode Construct.tokenize}
 * @see {@linkcode Event}
 * @see {@linkcode TokenizeContext}
 *
 * @this {void}
 *
 * @param {Event[]} events
 *  The current list of events
 * @param {TokenizeContext} context
 *  The tokenization context
 * @return {Event[]}
 *  The list of changed events
 */
type Resolver = (
  this: void,
  events: Event[],
  context: TokenizeContext
) => Event[]

export type { Resolver as default }

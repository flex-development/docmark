/**
 * @file Exiter
 * @module docmark-util-types/Exiter
 */

import type {
  Effects,
  TokenizeContext,
  Tokenizer
} from '@flex-development/docmark-util-types'

/**
 * The final hook to run when a container must be closed.
 *
 * > 👉 **Note**: Like a {@linkcode Tokenizer}, but without `ok` and `nok`, and
 * > returns `undefined`.
 *
 * @see {@linkcode Effects}
 * @see {@linkcode TokenizeContext}
 *
 * @this {TokenizeContext}
 *
 * @param {Effects} effects
 *  The context object to transition the state machine
 * @return {undefined}
 */
type Exiter = (this: TokenizeContext, effects: Effects) => undefined

export type { Exiter as default }
